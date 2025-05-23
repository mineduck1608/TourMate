using System;
using System.Collections.Generic;

namespace Repositories.Models;

public partial class TourGuide
{
    public int TourGuideId { get; set; }

    public string FullName { get; set; } = null!;

    public string Gender { get; set; } = null!;

    public DateOnly DateOfBirth { get; set; }

    public int AccountId { get; set; }

    public string Address { get; set; } = null!;

    public string Image { get; set; } = null!;

    public string Phone { get; set; } = null!;

    public virtual Account Account { get; set; } = null!;

    public virtual ICollection<Bid> Bids { get; set; } = new List<Bid>();

    public virtual ICollection<Feedback> Feedbacks { get; set; } = new List<Feedback>();

    public virtual ICollection<Invoice> Invoices { get; set; } = new List<Invoice>();

    public virtual ICollection<TourGuideDesc> TourGuideDescs { get; set; } = new List<TourGuideDesc>();

    public virtual ICollection<TourGuideRevenue> TourGuideRevenues { get; set; } = new List<TourGuideRevenue>();

    public virtual ICollection<TourService> TourServices { get; set; } = new List<TourService>();
}
