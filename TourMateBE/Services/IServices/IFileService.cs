using Repositories.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.IServices
{
    public interface IFileService
    {
        Task<FileStorage> GetFileAsync(string id);
        Task<bool> UploadFile(FileStorage fileStorage);
        Task<FileStorage> GetFileOfMessage(int messageId);
    }
}
