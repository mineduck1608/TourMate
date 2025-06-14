﻿using System;
using System.Collections.Generic;

namespace Repositories.Models;

public partial class UserLikeBid
{
    public int AccountId { get; set; }

    public int TourBidId { get; set; }

    public int LikeId { get; set; }

    public virtual Account Account { get; set; } = null!;

    public virtual TourBid TourBid { get; set; } = null!;
}
