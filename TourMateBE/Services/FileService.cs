using Repositories.Models;
using Repositories.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services
{
    public interface IFileService
    {
        Task<FileStorage> GetFileAsync(string id);
        Task<bool> UploadFile(FileStorage fileStorage);
        Task<FileStorage> GetFileOfMessage(int messageId);
    }
    public class FileService : IFileService
    {
        private readonly FileRepository _fileRepository;
        public FileService(FileRepository fileRepository)
        {
            _fileRepository = fileRepository;
        }
        public async Task<FileStorage> GetFileAsync(string id)
        {
            return await _fileRepository.GetByIdAsync(id);
        }

        public async Task<FileStorage> GetFileOfMessage(int messageId)
        {
            return await _fileRepository.GetFileOfMessageAsync(messageId);
        }

        public async Task<bool> UploadFile(FileStorage fileStorage)
        {
            return await _fileRepository.CreateAsync(fileStorage);
        }
    }
}
