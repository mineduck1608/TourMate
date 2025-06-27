using Microsoft.EntityFrameworkCore;
using Repositories.Context;
using Repositories.GenericRepository;
using Repositories.IRepositories;
using Repositories.Models;

namespace Repositories.Repositories
{
    public class PaymentsRepository : GenericRepository<Payment>, IPaymentsRepository
    {
        public PaymentsRepository(TourmateContext context) : base(context) { }

        public async Task<List<Payment>> GetByAccountId(int accountId)
        {
           var result = await _context.Payments.Include(i => i.Invoice).Include(mb => mb.MembershipPackage).Where(a => a.AccountId == accountId)
        .ToListAsync();
            return result;
        }
    }
}