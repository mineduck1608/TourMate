using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Repositories.Context;
using Repositories.IRepositories;
using Repositories.Repositories;
using Services.IServices;
using Services.Services;

namespace RemoveMembershipJob
{
    internal class Program
    {
        public static async Task Main(string[] args)
        {
            using IHost host = Host.CreateDefaultBuilder(args)
                .ConfigureServices((context, services) =>
                {
                    services.AddDbContext<TourmateContext>(options =>
                        options.UseSqlServer(context.Configuration.GetConnectionString("DefaultConnection")));

                    services.AddScoped<IAccountMembershipRepository, AccountMembershipRepository>();
                    services.AddScoped<IAccountMembershipService, AccountMembershipService>();
                    services.AddTransient<RemoveMembershipService>();
                })
                .Build();

            var service = host.Services.GetRequiredService<RemoveMembershipService>();
            await service.RunAsync(CancellationToken.None);
        }
    }
}
