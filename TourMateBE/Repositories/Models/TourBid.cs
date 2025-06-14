﻿using System;
using System.Collections.Generic;

namespace Repositories.Models;

public partial class TourBid
{
    public int TourBidId { get; set; }

    public int AccountId { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public bool IsDeleted { get; set; }

    public int PlaceRequested { get; set; }

    public string Status { get; set; } = null!;

    public string Content { get; set; } = null!;

    public float? MaxPrice { get; set; }

    public virtual Account Account { get; set; } = null!;

    public virtual ICollection<Bid> Bids { get; set; } = new List<Bid>();

    public virtual ActiveArea PlaceRequestedNavigation { get; set; } = null!;

    public virtual ICollection<TourBidComment> TourBidComments { get; set; } = new List<TourBidComment>();

    public virtual ICollection<UserLikeBid> UserLikeBids { get; set; } = new List<UserLikeBid>();
}
