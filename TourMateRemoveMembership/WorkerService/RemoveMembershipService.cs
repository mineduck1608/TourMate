using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Services.IServices;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace WorkerService
{
    public class RemoveMembershipService : IHostedService
    {
        private readonly ILogger<RemoveMembershipService> _logger;
        private readonly IServiceProvider _serviceProvider;

        public RemoveMembershipService(ILogger<RemoveMembershipService> logger, IServiceProvider serviceProvider)
        {
            _logger = logger;
            _serviceProvider = serviceProvider;
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            // async void pattern not recommended, better to queue a background task if needed
            _ = Task.Run(async () =>
            {
                using var scope = _serviceProvider.CreateScope();
                try
                {
                    var membershipService = scope.ServiceProvider.GetRequiredService<IAccountMembershipService>();
                    _logger.LogInformation("Membership deactivation job started at: {time}", DateTimeOffset.Now);
                    var r = await membershipService.DeactivateMembership();
                    _logger.LogInformation("Membership deactivation completed successfully");
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "An error occurred during membership deactivation");
                }
            });

            return Task.CompletedTask;
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            return Task.CompletedTask;
        }
    }
}


