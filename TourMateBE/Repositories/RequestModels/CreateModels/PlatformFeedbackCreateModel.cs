using Repositories.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.DTO.CreateModels
{
    public class PlatformFeedbackCreateModel
    {
        public int? FeedbackId { get; set; }

        public int AccountId { get; set; }

        public int PaymentId { get; set; }

        public DateTime CreatedAt { get; set; }

        public string Content { get; set; }

        public int Rating { get; set; }

        public PlatformFeedback Convert() => new()
        {
            FeedbackId = FeedbackId ?? 0,
            CreatedAt = CreatedAt,
            Content = Content,
            Rating = Rating,
            AccountId = AccountId,
            PaymentId = PaymentId
        };
    }
}
