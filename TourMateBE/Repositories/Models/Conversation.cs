using System;
using System.Collections.Generic;

namespace Repositories.Models;

public partial class Conversation
{
    public int ConersationId { get; set; }

    public int Account1Id { get; set; }

    public int Account2Id { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual Account Account1 { get; set; } = null!;

    public virtual Account Account2 { get; set; } = null!;

    public virtual ICollection<Message> Messages { get; set; } = new List<Message>();
}
