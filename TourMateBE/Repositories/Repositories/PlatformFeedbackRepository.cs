using Microsoft.EntityFrameworkCore;
using Repositories.GenericRepository;
using Repositories.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.Repositories
{
    public class PlatformFeedbackRepository : GenericRepository<PlatformFeedback>
    {
        public async Task<IEnumerable<PlatformFeedback>> GetAllPlatformFeedback()
        {
            return await _context.PlatformFeedbacks
                .Include(pf => pf.Account)
                .Include(pf => pf.Payment)
                .OrderByDescending(pf => pf.CreatedAt)
                .ToListAsync();
        }

        public async Task<PlatformFeedback?> GetPlatformFeedbackByIdAsync(int id)
        {
            return await _context.PlatformFeedbacks
                .Include(pf => pf.Account)
                .Include(pf => pf.Payment)
                .FirstOrDefaultAsync(pf => pf.FeedbackId == id);
        }

        public async Task<IEnumerable<PlatformFeedback>> GetByAccountIdAsync(int accountId)
        {
            return await _context.PlatformFeedbacks
                .Include(pf => pf.Account)
                .Include(pf => pf.Payment)
                .Where(pf => pf.AccountId == accountId)
                .OrderByDescending(pf => pf.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<PlatformFeedback>> GetByRatingAsync(int rating)
        {
            return await _context.PlatformFeedbacks
                .Include(pf => pf.Account)
                .Include(pf => pf.Payment)
                .Where(pf => pf.Rating == rating)
                .OrderByDescending(pf => pf.CreatedAt)
                .ToListAsync();
        }

        public async Task<decimal> GetAverageRatingAsync()
        {
            var feedbacks = await _context.PlatformFeedbacks.ToListAsync();
            if (!feedbacks.Any())
                return 0;

            return (decimal)feedbacks.Average(f => f.Rating);
        }

        public async Task<Dictionary<int, int>> GetRatingDistributionAsync()
        {
            var distribution = await _context.PlatformFeedbacks
                .GroupBy(f => f.Rating)
                .Select(g => new { Rating = g.Key, Count = g.Count() })
                .ToDictionaryAsync(x => x.Rating, x => x.Count);

            // Ensure all ratings 1-5 are present
            for (int i = 1; i <= 5; i++)
            {
                if (!distribution.ContainsKey(i))
                    distribution[i] = 0;
            }

            return distribution;
        }
    }
}
