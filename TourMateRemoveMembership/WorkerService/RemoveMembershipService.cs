using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace WorkerService
{
    public class RemoveMembershipService : BackgroundService
    {
        private readonly ILogger<RemoveMembershipService> _logger;
        private readonly RemoveMembership _removeMembership;

        public RemoveMembershipService(ILogger<RemoveMembershipService> logger)
        {
            _logger = logger;
            _removeMembership = new RemoveMembership();
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                if (_logger.IsEnabled(LogLevel.Information))
                {
                    _logger.LogInformation("Worker running at: {time}", DateTimeOffset.Now);
                }

                // Call DoSomething every minute
                _removeMembership.DoSomething();

                await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
            }
        }
    }
}
