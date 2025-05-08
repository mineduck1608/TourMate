using System;
using System.Collections.Generic;

namespace Repositories.Models;

public partial class BlogComment
{
    public int BlogCommentId { get; set; }

    public int AccountId { get; set; }

    public int BlogId { get; set; }

    public string Content { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public bool IsDeleted { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual Account Account { get; set; } = null!;

    public virtual Blog Blog { get; set; } = null!;

    public virtual ICollection<BlogCommentReply> BlogCommentReplies { get; set; } = new List<BlogCommentReply>();
}
