using Repositories.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.DTO.CreateModels
{
    public class CommentCreateModel
    {
        public int AccountId { get; set; }

        public int TourBidId { get; set; }

        public string Content { get; set; } = null!;
        public TourBidComment Convert() => new()
        {
            AccountId = AccountId,
            Content = Content,
            CreatedAt = DateTime.UtcNow,
            IsDeleted = false,
            TourBidId = TourBidId
        };
    }
}
