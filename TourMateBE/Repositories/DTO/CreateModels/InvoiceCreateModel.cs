using Repositories.Models;

namespace Repositories.DTO.CreateModels
{
    public class InvoiceCreateModel
    {
        public DateTime StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        public int TourGuideId { get; set; }

        public string PeopleAmount { get; set; }

        public string Status { get; set; }

        public float Price { get; set; }

        public string Note { get; set; }

        public int CustomerId { get; set; }

        public int AreaId { get; set; }

        public string TourDesc { get; set; }

        public DateTime CreatedDate { get; set; }
        public Invoice Convert() => new()
        {
            StartDate = StartDate,
            EndDate = EndDate,
            CustomerId = CustomerId,
            AreaId = AreaId,
            TourDesc = TourDesc,
            InvoiceId = 0,
            CreatedDate = CreatedDate,
            Note = Note,
            PeopleAmount = PeopleAmount,
            Status = Status,
            Price = Price,
            
        };
    }
}