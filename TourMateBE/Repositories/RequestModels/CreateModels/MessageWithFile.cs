using Repositories.Models;

namespace Repositories.DTO.CreateModels
{
    public class MessageWithFile
    {
        public int ConversationId { get; set; }

        public int SenderId { get; set; }

        public string MessageText { get; set; }

        public bool IsRead { get; set; }
        public FileUploadModel File { get; set; }
        public Message Convert() => new()
        {
            ConversationId = ConversationId,
            SenderId = SenderId,
            MessageText = MessageText,
            SendAt = DateTime.UtcNow,
            IsRead = IsRead,
            IsEdited = false,
            IsDeleted = false,
            MessageId = 0,
            File = File.Convert()
        };
    }
}