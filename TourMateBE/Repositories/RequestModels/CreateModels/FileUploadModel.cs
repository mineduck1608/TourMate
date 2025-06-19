using Repositories.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.DTO.CreateModels
{
    public class FileUploadModel
    {
        public string FileName { get; set; }
        public string DownloadUrl { get; set; }
        public FileStorage Convert() => new FileStorage
        {
            Id = Guid.NewGuid().ToString().Replace("-", ""),
            FileName = FileName,
            UploadTime = DateTime.UtcNow,
            DownloadUrl = DownloadUrl
        };
    }
}
