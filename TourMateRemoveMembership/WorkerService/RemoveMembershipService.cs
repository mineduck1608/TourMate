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
        private IAccountMembershipService _accountMembershipService;

        public RemoveMembershipService(ILogger<RemoveMembershipService> logger, IAccountMembershipService accountMembershipService)
        {
            _logger = logger;
            _accountMembershipService = accountMembershipService;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                _logger.LogInformation("Worker running at: {time}", DateTimeOffset.Now);
                var r = await _accountMembershipService.DeactivateMembership();
                _logger.LogInformation(r ? "Ok" : "Error");

                await Task.Delay(TimeSpan.FromSeconds(15), stoppingToken);
            }
        }
    }
}


