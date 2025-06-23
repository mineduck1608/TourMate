using Repositories.Context;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RemoveMembership
{
    public class RemoveMembership
    {
        private readonly TourmateContext _context;
        private readonly ILogger<RemoveMembership> _logger;
        public RemoveMembership(TourmateContext context, ILogger<RemoveMembership> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task ExecuteRemoveMembership(CancellationToken cancellationToken)
        {
            _logger.LogInformation("Logged");
        }
    }
}
