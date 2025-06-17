using Repositories.Models;
using Repositories.Repositories;
using Repositories.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services
{
    public interface IPlatformFeedbackService 
    {
        Task<bool> CreatePlatformFeedback(PlatformFeedback data);

    }

    public class PlatformFeedbackService : IPlatformFeedbackService
    {
        private PlatformFeedbackRepository repository { get; set; } = new();

        public async Task<bool> CreatePlatformFeedback(PlatformFeedback data)
        {
            return await repository.CreateAsync(data);
        }

    }
}
