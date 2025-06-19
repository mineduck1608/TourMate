using Repositories.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.DTO.UpdateModels
{
    public class CommentUpdateModel
    {
        public int CommentId { get; set; }
        public string Content { get; set; }
        public int AccountId { get; set; }
        public int TourBidId { get; set; }
        public TourBidComment Convert()
        {
            return new TourBidComment
            {
                CommentId = CommentId,
                Content = Content,
                AccountId = AccountId,
                TourBidId = TourBidId,
            };
        }
    }
}
