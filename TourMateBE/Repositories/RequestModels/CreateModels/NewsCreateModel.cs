using Repositories.Models;

namespace Repositories.DTO.CreateModels
{
    public class NewsCreateModel
    {
        public string Title { get; set; }

        public DateTime CreatedAt { get; set; }

        public bool IsDeleted { get; set; }

        public string Content { get; set; }

        public string BannerImg { get; set; }
        public string Category { get; set; }
        public News Convert() => new()
        {
            Title = Title,
            CreatedAt = CreatedAt,
            Content = Content,
            BannerImg = BannerImg,
            NewsId = 0,
            Category = Category,
        };
    }
}