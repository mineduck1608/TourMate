using System;
using System.Collections.Generic;

namespace Repositories.Models;

public partial class FileStorage
{
    public string Id { get; set; } = null!;

    public string FileName { get; set; } = null!;

    public string DownloadUrl { get; set; } = null!;

    public DateTime? UploadTime { get; set; }

    public virtual ICollection<Message> Messages { get; set; } = new List<Message>();
}
