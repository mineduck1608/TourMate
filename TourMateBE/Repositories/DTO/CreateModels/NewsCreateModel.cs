using Repositories.Models;

namespace Repositories.DTO.CreateModels
{
    public class NewsCreateModel
    {
        public string Title { get; set; }

        public DateTime CreatedDate { get; set; }

        public bool IsDeleted { get; set; }

        public string Content { get; set; }

        public string BannerImg { get; set; }
        public News Convert() => new()
        {
            Title = Title,
            CreatedDate = CreatedDate,
            IsDeleted = IsDeleted,
            Content = Content,
            BannerImg = BannerImg,
            NewsId = 0,
        };
    }
}