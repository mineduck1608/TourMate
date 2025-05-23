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


    public ChatHub(IMessagesService messageService, IAccountService accountService, ICustomerService customerService, ITourGuideService tourGuideService)
    {
        _messageService = messageService;
        _accountService = accountService;
        _customerService = customerService;
        _tourGuideService = tourGuideService;
    }


    public async Task SendMessage(int conversationId, string messageText, int senderId, int messageTypeId)
    {
        var message = await SaveMessageToDb(conversationId, messageText, senderId, messageTypeId);

        // Gửi tin nhắn cho tất cả client trong conversation (nhóm)
        await Clients.Group(conversationId.ToString()).SendAsync("ReceiveMessage", message);
    }

    public override async Task OnConnectedAsync()
    {
        var httpContext = Context.GetHttpContext();
        var conversationId = httpContext.Request.Query["conversationId"];

        if (!string.IsNullOrEmpty(conversationId))
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, conversationId);
        }

        await base.OnConnectedAsync();
    }

    private async Task<MessageDto> SaveMessageToDb(int conversationId, string text, int senderId, int messageTypeId)
    {
        var result = await _messageService.CreateMessages(new Message
        {
            ConversationId = conversationId,
            SenderId = senderId,
            MessageText = text,
            SendAt = DateTime.Now,
            IsRead = false,
            IsDeleted = false,
            IsEdited = false,
            MessageTypeId = messageTypeId
        });
        if(result != null)
        {
            var account = await _accountService.GetAccount(senderId);
            var name = "Người dùng";
            if(account.RoleId == 2)
            {
                var customer = await _customerService.GetCustomerByAccId(senderId);
                name = customer.FullName;
            }
            if (account.RoleId == 3)
            {
                var tourGuide = await _tourGuideService.GetTourGuideByAccId(senderId);
                name = tourGuide.FullName;
            }
            // TODO: Lưu tin nhắn vào database, trả về DTO Message
            return new MessageDto
            {
                MessageId = result.MessageId,
                ConversationId = conversationId,
                MessageText = text,
                SendAt = DateTime.UtcNow,
                SenderId = senderId,
                SenderName = name
            };
        }
        return null;

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
}
