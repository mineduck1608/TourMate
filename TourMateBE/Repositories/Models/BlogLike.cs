using System;
using System.Collections.Generic;

namespace Repositories.Models;

public partial class BlogLike
{
    public int BlogLikeId { get; set; }

    public int AccountId { get; set; }

    public int BlogId { get; set; }

    public virtual Account Account { get; set; } = null!;

    public virtual Blog Blog { get; set; } = null!;
}
