using System;
using System.Collections.Generic;

namespace Repositories.Models;

public partial class MessageType
{
    public int MessageTypeId { get; set; }

    public string TypeName { get; set; } = null!;

    public virtual ICollection<Message> Messages { get; set; } = new List<Message>();
}
