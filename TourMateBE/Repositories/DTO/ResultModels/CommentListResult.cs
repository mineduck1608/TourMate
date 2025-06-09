using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.DTO.ResultModels
{
    public class CommentListResult
    {
        public int CommentId { get; set; }

        public int AccountId { get; set; }

        public int TourBidId { get; set; }

        public string Content { get; set; } = null!;

        public DateTime CreatedAt { get; set; }
        public string Image { get; set; } = null!;
        public string FullName { get; set; } = null!;
    }
}
