using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace YourProject.Worker
{
    public class RemoveMembershipService : BackgroundService
    {
        private readonly ILogger<RemoveMembershipService> _logger;
        private readonly IServiceProvider _services;

        public RemoveMembershipService(ILogger<RemoveMembershipService> logger, IServiceProvider services)
        {
            _logger = logger;
            _services = services;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                var now = DateTime.Now;
                var nextMidnight = now.Date.AddMinutes(1); // Tomorrow midnight
                var delay = nextMidnight - now;

                _logger.LogInformation("Worker sleeping until {NextRunTime}", nextMidnight);
                await Task.Delay(delay, stoppingToken);

                if (stoppingToken.IsCancellationRequested) break;

                try
                {
                    using (var scope = _services.CreateScope())
                    {
                        var service = scope.ServiceProvider.GetRequiredService<RemoveMembership.RemoveMembership>();
                        await service.ExecuteRemoveMembership(stoppingToken);
                    }
                    _logger.LogInformation("Nightly task completed at {Time}", DateTime.Now);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Nightly task failed");
                }
            }
        }
    }
}