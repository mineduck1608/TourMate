using Services.IServices;

public class RemoveMembershipService
{
    private readonly ILogger<RemoveMembershipService> _logger;
    private readonly IServiceProvider _serviceProvider;

    public RemoveMembershipService(ILogger<RemoveMembershipService> logger, IServiceProvider serviceProvider)
    {
        _logger = logger;
        _serviceProvider = serviceProvider;
    }

    public async Task RunAsync(CancellationToken cancellationToken)
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
    }
}
