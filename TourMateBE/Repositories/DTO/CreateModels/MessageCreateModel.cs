using Repositories.Models;

namespace Repositories.DTO.CreateModels
{
    public class MessageCreateModel
    {
        public int ConversationId { get; set; }

        public int SenderId { get; set; }

        public string MessageText { get; set; }


        public DateTime SendAt { get; set; }

        public bool IsRead { get; set; }

        public bool IsEdited { get; set; }

        public bool IsDeleted { get; set; }
        public Message Convert() => new()
        {
            ConversationId = ConversationId,
            SenderId = SenderId,
            MessageText = MessageText,
            SendAt = SendAt,
            IsRead = IsRead,
            IsEdited = IsEdited,
            IsDeleted = IsDeleted,
            MessageId = 0,
        };
    }
}