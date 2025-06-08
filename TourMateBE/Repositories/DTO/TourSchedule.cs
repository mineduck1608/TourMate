using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.DTO
{
    public class TourSchedule
    {
        public int InvoiceId { get; set; } 
        public string CustomerName { get; set; } = string.Empty;
        public string CustomerPhone { get; set; } = string.Empty;
        public string TourGuideName { get; set; } = string.Empty;
        public string TourGuidePhone { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string TourName { get; set; } = string.Empty;
        public string TourDesc { get; set; } = string.Empty;
        public string AreaName { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string PeopleAmount { get; set; } = string.Empty;
        public float Price { get; set; }
        public string PaymentMethod { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string Note { get; set; } = string.Empty;
        public DateTime CreatedDate { get; set; }
        public int TourGuideAccountId { get; set; }
    }
}
