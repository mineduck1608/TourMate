using Repositories.Models;
using Repositories.GenericRepository;
using Microsoft.EntityFrameworkCore;

namespace Repositories.Repository
{
    public class PaymentsRepository : GenericRepository<Payment>
    {
        public async Task<List<Payment>> GetByAccountId(int accountId)
        {
           var result = await _context.Payments.Include(i => i.Invoice).Include(mb => mb.MembershipPackage).Where(a => a.AccountId == accountId)
        .ToListAsync();
            return result;
        }
    }
}