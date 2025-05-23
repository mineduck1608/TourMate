﻿using System;
using System.Collections.Generic;

namespace Repositories.Models;

public partial class News
{
    public int NewsId { get; set; }

    public string Title { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public string Content { get; set; } = null!;

    public string BannerImg { get; set; } = null!;

    public string? Category { get; set; }
}
