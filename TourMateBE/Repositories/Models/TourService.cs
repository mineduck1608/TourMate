using System;
using System.Collections.Generic;

namespace Repositories.Models;

public partial class TourService
{
    public int ServiceId { get; set; }

    public string ServiceName { get; set; } = null!;

    public float Price { get; set; }

    public TimeOnly Duration { get; set; }

    public string Content { get; set; } = null!;

    public string Image { get; set; } = null!;

    public int TourGuideId { get; set; }

    public DateOnly CreatedDate { get; set; }

    public bool IsDeleted { get; set; }

    public virtual TourGuide TourGuide { get; set; } = null!;
}
