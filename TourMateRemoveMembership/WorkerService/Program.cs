using Microsoft.EntityFrameworkCore;
using Repositories.Context;
using Repositories.IRepositories;
using Repositories.Repositories;
using Services.IServices;
using Services.Services;

namespace WorkerService
{
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run(); // no await here, keep service running
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureServices((hostContext, services) =>
                {
                    services.AddDbContext<TourmateContext>(options =>
                        options.UseSqlServer(hostContext.Configuration.GetConnectionString("DefaultConnection")));

                    services.AddScoped<IAccountMembershipRepository, AccountMembershipRepository>();
                    services.AddScoped<IAccountMembershipService, AccountMembershipService>();
                    services.AddHostedService<RemoveMembershipService>(); // REGISTER as hosted service
                });
    }
}