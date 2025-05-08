using System;
using System.Collections.Generic;

namespace Repositories.Models;

public partial class NewsCategory
{
    public int NewsCategoryId { get; set; }

    public int CategoryId { get; set; }

    public int NewsId { get; set; }

    public virtual Category Category { get; set; } = null!;

    public virtual News News { get; set; } = null!;
}
