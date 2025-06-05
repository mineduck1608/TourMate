using System;
using System.Collections.Generic;

namespace Repositories.Models;

public partial class UserLikeTourBid
{
    public int? TourBidId { get; set; }

    public int? AccountId { get; set; }

    public virtual Account? Account { get; set; }

    public virtual TourBid? TourBid { get; set; }
}
