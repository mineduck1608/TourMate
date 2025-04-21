using Repositories.Models;

namespace Repositories.DTO.CreateModels
{
    public class ContactCreateModel
    {
        public string FullName { get; set; }

        public string Phone { get; set; }

        public string Email { get; set; }

        public string Title { get; set; }

        public string Content { get; set; }

        public DateTime CreatedAt { get; set; }

        public bool IsProcessed { get; set; }
        public Contact Convert() => new Contact()
        {
            FullName = FullName,
            Phone = Phone,
            Email = Email,
            Title = Title,
            Content = Content,
            CreatedAt = CreatedAt,
            IsProcessed = IsProcessed,
            ContactId = 0
        };
    }
}