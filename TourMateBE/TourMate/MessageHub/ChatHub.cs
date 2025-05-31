using Microsoft.AspNetCore.SignalR;
using Repositories.Models;
using Services;

namespace TourMate.MessageHub;

public class ChatHub : Hub
{
    private readonly IMessagesService _messageService;
    private readonly IAccountService _accountService;
    private readonly ICustomerService _customerService;
    private readonly ITourGuideService _tourGuideService;

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

    // ✅ Client sẽ gọi method này để join group theo conversationId
    public async Task JoinConversation(int conversationId)
    {
        var connectionId = Context.ConnectionId;
        await Groups.AddToGroupAsync(connectionId, conversationId.ToString());
        Console.WriteLine($"Connection {connectionId} joined conversation {conversationId}");
    }

    public async Task SendMessage(int conversationId, string messageText, int senderId)
    {
        try
        {
            var message = await SaveMessageToDb(conversationId, messageText, senderId);
            if (message == null)
            {
                throw new HubException("Failed to save message");
            }

            // ✅ Gửi tin nhắn đến tất cả client trong group (conversation)
            await Clients.Group(conversationId.ToString()).SendAsync("ReceiveMessage", message);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"SendMessage error: {ex}");
            throw new HubException($"SendMessage error: {ex.Message}");
        }
    }

    public override Task OnConnectedAsync()
    {
        Console.WriteLine($"Client connected: {Context.ConnectionId}");
        return base.OnConnectedAsync();
    }

    public override Task OnDisconnectedAsync(Exception exception)
    {
        Console.WriteLine(
            exception != null
                ? $"Client disconnected with error: {Context.ConnectionId}, Exception: {exception.Message}"
                : $"Client disconnected gracefully: {Context.ConnectionId}"
        );
        return base.OnDisconnectedAsync(exception);
    }

    private async Task<MessageDto> SaveMessageToDb(int conversationId, string text, int senderId)
    {
        var message = new Message
        {
            ConversationId = conversationId,
            SenderId = senderId,
            MessageText = text,
            SendAt = DateTime.Now,
            IsRead = false,
            IsDeleted = false,
            IsEdited = false,
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
            IsRead = false
        };
    }
}

public class MessageDto
{
    public int MessageId { get; set; }
    public int ConversationId { get; set; }
    public string MessageText { get; set; }
    public DateTime SendAt { get; set; }
    public int SenderId { get; set; }
    public string SenderName { get; set; }
    public string SenderAvatarUrl { get; set; }
    public bool IsRead { get; set; }
}
