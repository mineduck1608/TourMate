using System;
using System.Collections.Generic;

namespace Repositories.Models;

public partial class TourGuideRevenue
{
    public int TourGuideRevenueId { get; set; }

    public int PaymentId { get; set; }

    public float Value { get; set; }

    public int TourGuideId { get; set; }

    public virtual Payment Payment { get; set; } = null!;

    public virtual TourGuide TourGuide { get; set; } = null!;
}
