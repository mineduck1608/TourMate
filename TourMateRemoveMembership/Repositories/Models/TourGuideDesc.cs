using System;
using System.Collections.Generic;

namespace Repositories.Models;

public partial class TourGuideDesc
{
    public int TourGuideDescId { get; set; }

    public int TourGuideId { get; set; }

    public int? YearOfExperience { get; set; }

    public string Description { get; set; } = null!;

    public int AreaId { get; set; }

    public string? Company { get; set; }

    public virtual ActiveArea Area { get; set; } = null!;

    public virtual TourGuide TourGuide { get; set; } = null!;
}
