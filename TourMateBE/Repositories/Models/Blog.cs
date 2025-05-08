using System;
using System.Collections.Generic;

namespace Repositories.Models;

public partial class Blog
{
    public int BlogId { get; set; }

    public DateTime CreatedDate { get; set; }

    public bool IsDeleted { get; set; }

    public string Content { get; set; } = null!;

    public string Media { get; set; } = null!;

    public DateTime? UpdatedAt { get; set; }

    public int AccountId { get; set; }

    public virtual Account Account { get; set; } = null!;

    public virtual ICollection<BlogComment> BlogComments { get; set; } = new List<BlogComment>();

    public virtual ICollection<BlogLike> BlogLikes { get; set; } = new List<BlogLike>();
}
