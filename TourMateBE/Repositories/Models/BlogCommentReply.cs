using System;
using System.Collections.Generic;

namespace Repositories.Models;

public partial class BlogCommentReply
{
    public int BlogCommentReplyId { get; set; }

    public int AccountId { get; set; }

    public int BlogCommentId { get; set; }

    public string Content { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public bool IsDeleted { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual Account Account { get; set; } = null!;

    public virtual BlogComment BlogComment { get; set; } = null!;
}
