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
            var builder = Host.CreateApplicationBuilder(args);
            builder.Services.AddDbContext<TourmateContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))
            );
            builder.Services.AddScoped<IAccountMembershipRepository, AccountMembershipRepository>();
            builder.Services.AddScoped<IAccountMembershipService, AccountMembershipService>();
            builder.Services.AddHostedService<RemoveMembershipService>();

            var host = builder.Build();
            host.Run();
        }
    }
}