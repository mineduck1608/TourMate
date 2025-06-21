using Repositories.Models;
using Repositories.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Services.IServices;

namespace Services.Services
{
    public class FileService : IFileService
    {
        private readonly IFileRepository _fileRepository;
        public FileService(IFileRepository fileRepository)
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
