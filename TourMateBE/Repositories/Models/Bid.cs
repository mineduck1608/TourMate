using System;
using System.Collections.Generic;

namespace Repositories.Models;

public partial class Bid
{
    public int BidId { get; set; }

    public int TourBidId { get; set; }

    public int TourGuideId { get; set; }

    public float Amount { get; set; }

    public DateTime CreatedAt { get; set; }

    public string? Comment { get; set; }

    public string Status { get; set; } = null!;

    public virtual TourBid TourBid { get; set; } = null!;

    public virtual TourGuide TourGuide { get; set; } = null!;
}
