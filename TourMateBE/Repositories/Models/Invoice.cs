using System;
using System.Collections.Generic;

namespace Repositories.Models;

public partial class Invoice
{
    public int InvoiceId { get; set; }

    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }

    public int TourGuideId { get; set; }

    public string PeopleAmount { get; set; } = null!;

    public string Status { get; set; } = null!;

    public float Price { get; set; }

    public string Note { get; set; } = null!;

    public int CustomerId { get; set; }

    public int AreaId { get; set; }

    public string TourDesc { get; set; } = null!;

    public DateTime CreatedDate { get; set; }

    public string CustomerPhone { get; set; } = null!;

    public string TourName { get; set; } = null!;

    public virtual ActiveArea Area { get; set; } = null!;

    public virtual Customer Customer { get; set; } = null!;

    public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();

    public virtual TourGuide TourGuide { get; set; } = null!;
}
