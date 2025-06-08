using System;
using System.Collections.Generic;

namespace Repositories.Models;

public partial class TourBidComment
{
    public int CommentId { get; set; }

    public int AccountId { get; set; }

    public int TourBidId { get; set; }

    public string Content { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public bool IsDeleted { get; set; }

    public virtual Account Account { get; set; } = null!;

    public virtual TourBid TourBid { get; set; } = null!;
}
