using Repositories.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.DTO.UpdateModals
{
    public class NewsUpdateModel
    {
        public int NewsId { get; set; }
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
            Category = Category,
            BannerImg = BannerImg,
            NewsId = NewsId,
        };
    }
}