using Repositories.Models;
using Repositories.ResponseModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.IServices
{
    public interface ICvapplicationService
    {
        Task<Cvapplication> GetCvapplication(int id);
        Task<PagedResult<Cvapplication>> GetAll(int pageSize, int pageIndex);
        Task<bool> CreateCvapplication(Cvapplication cvapplication);
        Task<bool> UpdateCvapplication(Cvapplication cvapplication);
        bool DeleteCvapplication(int id);
    }
}
