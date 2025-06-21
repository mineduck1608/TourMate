using Microsoft.AspNetCore.SignalR;
using Repositories.DTO.CreateModels;
using Repositories.Models;
using Services.IServices;
using System.Collections.Concurrent;

namespace TourMate.MessageHub;

public class ChatHub : Hub
{
    private readonly IMessagesService _messageService;
    private readonly IAccountService _accountService;
    private readonly ICustomerService _customerService;
    private readonly ITourGuideService _tourGuideService;

    // Use thread-safe dictionary
    private static readonly ConcurrentDictionary<string, CallInfo> ActiveCalls = new();

    public ChatHub(
        IMessagesService messageService,
        IAccountService accountService,
        ICustomerService customerService,
        ITourGuideService tourGuideService)
    {
        _messageService = messageService;
        _accountService = accountService;
        _customerService = customerService;
        _tourGuideService = tourGuideService;
    }

    // ======================== DTO Definitions ============================

    public class OfferDto
    {
        public string Type { get; set; } = string.Empty;
        public string Sdp { get; set; } = string.Empty;
    }

    public class IceCandidateDto
    {
        public string Candidate { get; set; } = string.Empty;
        public string SdpMid { get; set; } = string.Empty;
        public int? SdpMLineIndex { get; set; }
    }

    public class CallInfo
    {
        public string CallId { get; set; } = string.Empty;
        public int FromAccountId { get; set; }
        public int ToAccountId { get; set; }
        public string CallType { get; set; } = string.Empty;
        public int ConversationId { get; set; }
        public DateTime CreatedAt { get; set; }
        public string Status { get; set; } = "calling";
    }

    public class InitiateCallRequest
    {
        public string CallId { get; set; } = string.Empty;
        public int FromAccountId { get; set; }
        public int ToAccountId { get; set; }
        public string CallType { get; set; } = string.Empty;
        public int ConversationId { get; set; }
    }

    public class CallActionRequest
    {
        public string CallId { get; set; } = string.Empty;
        public int AcceptedBy { get; set; }
        public int RejectedBy { get; set; }
        public int EndedBy { get; set; }
    }

    public class MessageDto
    {
        public int MessageId { get; set; }
        public int ConversationId { get; set; }
        public string MessageText { get; set; } = string.Empty;
        public DateTime SendAt { get; set; }
        public int SenderId { get; set; }
        public string SenderName { get; set; } = string.Empty;
        public string SenderAvatarUrl { get; set; } = string.Empty;
        public string DownloadUrl { get; set; }
        public string FileName { get; set; }
    }

    // ======================== Call Flow ============================

    public async Task InitiateCall(InitiateCallRequest request)
    {
        var callInfo = new CallInfo
        {
            CallId = request.CallId,
            FromAccountId = request.FromAccountId,
            ToAccountId = request.ToAccountId,
            CallType = request.CallType,
            ConversationId = request.ConversationId,
            CreatedAt = DateTime.UtcNow
        };

        ActiveCalls[request.CallId] = callInfo;

        await Clients.Group(request.ConversationId.ToString()).SendAsync("ReceiveCallOffer", request);
    }

    public async Task AcceptCall(CallActionRequest request)
    {
        if (!ActiveCalls.TryGetValue(request.CallId, out var callInfo))
            throw new HubException("Call not found");

        callInfo.Status = "connected";

        await Clients.Group(callInfo.ConversationId.ToString())
            .SendAsync("CallAccepted", request);
    }

    public async Task RejectCall(CallActionRequest request)
    {
        if (ActiveCalls.TryRemove(request.CallId, out var callInfo))
        {
            callInfo.Status = "ended";

            await Clients.Group(callInfo.ConversationId.ToString())
                .SendAsync("CallRejected", request);
        }
    }

    public async Task EndCall(CallActionRequest request)
    {
        if (ActiveCalls.TryRemove(request.CallId, out var callInfo))
        {
            callInfo.Status = "ended";

            await Clients.Group(callInfo.ConversationId.ToString())
                .SendAsync("CallEnded", request);
        }
    }

    // ======================== WebRTC Signaling ============================

    public async Task SendOffer(int conversationId, int toAccountId, OfferDto offer, int fromAccountId, string callType)
    {
        await Clients.Group(conversationId.ToString())
            .SendAsync("ReceiveOffer", toAccountId, offer, fromAccountId, callType);
    }

    public async Task SendAnswer(int conversationId, int toAccountId, OfferDto answer)
    {
        await Clients.Group(conversationId.ToString())
            .SendAsync("ReceiveAnswer", toAccountId, answer);
    }

    public async Task SendIceCandidate(int conversationId, int toAccountId, IceCandidateDto candidate)
    {
        await Clients.Group(conversationId.ToString())
            .SendAsync("ReceiveIceCandidate", toAccountId, candidate);
    }

    // ======================== Chat Messages ============================

    public async Task SendMessage(int conversationId, string messageText, int senderId)
    {
        var message = await SaveMessageToDb(conversationId, messageText, senderId);
        if (message == null) throw new HubException("Failed to save message");

        await Clients.Group(conversationId.ToString()).SendAsync("ReceiveMessage", message);
    }

    public async Task JoinConversation(int conversationId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, conversationId.ToString());
    }

    // ======================== Handle Disconnection ============================

    public override async Task OnDisconnectedAsync(Exception exception)
    {
        foreach (var call in ActiveCalls.Where(c => c.Value.Status != "ended").ToList())
        {
            await Clients.Group(call.Value.ConversationId.ToString()).SendAsync("CallEnded", new
            {
                CallId = call.Key,
                EndedBy = -1,
                Reason = "Disconnected"
            });
            ActiveCalls.TryRemove(call.Key, out _);
        }

        await base.OnDisconnectedAsync(exception);
    }
    [HubMethodName("SendWithFile")]
    public async Task SendWithFile(int conversationId, string messageText, int senderId, string fileName, string downloadUrl)
    {
        var fileUpload = new FileUploadModel()
        {
            DownloadUrl = downloadUrl,
            FileName = fileName
        };
        try
        {
            var message = await SaveMessageToDb(conversationId, messageText, senderId, fileUpload);
            if (message == null)
            {
                throw new HubException("Failed to save message with file");
            }
            message.MessageText = $"{message.MessageText}"; // Append file URL to message text
            await Clients.Group(conversationId.ToString()).SendAsync("ReceiveMessage", message);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"SendWithFile error: {ex}");
            throw new HubException($"SendWithFile error: {ex.Message}");
        }
    }

    // ======================== Helpers ============================

    private async Task<MessageDto?> SaveMessageToDb(int conversationId, string text, int senderId)
    {
        var message = new Message
        {
            ConversationId = conversationId,
            SenderId = senderId,
            MessageText = text,
            SendAt = DateTime.UtcNow,
            IsRead = false,
            IsDeleted = false,
            IsEdited = false
        };

        var result = await _messageService.CreateMessages(message);
        if (result == null) return null;

        var account = await _accountService.GetAccount(senderId);
        var (name, avatar) = account.RoleId switch
        {
            2 => ((await _customerService.GetCustomerByAccId(senderId)).FullName, (await _customerService.GetCustomerByAccId(senderId)).Image),
            3 => ((await _tourGuideService.GetTourGuideByAccId(senderId)).FullName, (await _tourGuideService.GetTourGuideByAccId(senderId)).Image),
            _ => ("User", "")
        };

        return new MessageDto
        {
            MessageId = result.MessageId,
            ConversationId = conversationId,
            MessageText = text,
            SendAt = result.SendAt,
            SenderId = senderId,
            SenderName = name,
            SenderAvatarUrl = avatar
        };
    }
    private async Task<MessageDto> SaveMessageToDb(int conversationId, string text, int senderId, FileUploadModel data)
    {
        var file = data.Convert();
        var message = new Message
        {
            ConversationId = conversationId,
            SenderId = senderId,
            MessageText = text,
            SendAt = DateTime.UtcNow,
            IsRead = false,
            IsDeleted = false,
            IsEdited = false,
            File = file
        };

        var result = await _messageService.CreateMessages(message);
        if (result == null) return null;

        var account = await _accountService.GetAccount(senderId);
        var name = "Người dùng";
        var avatar = "";

        if (account.RoleId == 2)
        {
            var customer = await _customerService.GetCustomerByAccId(senderId);
            name = customer.FullName;
            avatar = customer.Image;
        }
        else if (account.RoleId == 3)
        {
            var tourGuide = await _tourGuideService.GetTourGuideByAccId(senderId);
            name = tourGuide.FullName;
            avatar = tourGuide.Image;
        }

        return new MessageDto
        {
            MessageId = result.MessageId,
            ConversationId = conversationId,
            MessageText = text,
            SendAt = result.SendAt,
            SenderId = senderId,
            SenderName = name,
            SenderAvatarUrl = avatar,
            DownloadUrl = data.DownloadUrl,
            FileName = data.FileName
        };
    }
}