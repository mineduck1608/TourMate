using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Services.IServices;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace WorkerService
{
    public class RemoveMembershipService : BackgroundService
    {
        private readonly ILogger<RemoveMembershipService> _logger;
        private readonly IServiceProvider _serviceProvider;

        public RemoveMembershipService(ILogger<RemoveMembershipService> logger, IServiceProvider serviceProvider)
        {
            _logger = logger;
            _serviceProvider = serviceProvider;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                using (var scope = _serviceProvider.CreateScope())
                {
                    try
                    {
                        var membershipService = scope.ServiceProvider.GetRequiredService<IAccountMembershipService>();
                        _logger.LogInformation("Worker running at: {time}", DateTimeOffset.Now);
                        var r = await membershipService.DeactivateMembership();
                        _logger.LogInformation("Ok");
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "An error occurred while executing the RemoveMembershipService.");
                    }
                }

                await Task.Delay(TimeSpan.FromHours(12), stoppingToken);
            }
        }
    }
}


