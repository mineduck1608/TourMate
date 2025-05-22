using System;
using System.Collections.Generic;

namespace Repositories.Models;

public partial class ActiveArea
{
    public int AreaId { get; set; }

    public string AreaName { get; set; } = null!;

    public string AreaTitle { get; set; } = null!;

    public string AreaSubtitle { get; set; } = null!;

    public string AreaContent { get; set; } = null!;

    public string BannerImg { get; set; } = null!;

    public string AreaType { get; set; } = null!;

    public DateTime? CreatedAt { get; set; }

    public virtual ICollection<Invoice> Invoices { get; set; } = new List<Invoice>();

    public virtual ICollection<TourBid> TourBids { get; set; } = new List<TourBid>();

    public virtual ICollection<TourGuideDesc> TourGuideDescs { get; set; } = new List<TourGuideDesc>();
}
