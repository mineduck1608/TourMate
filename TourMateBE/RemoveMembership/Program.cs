using Microsoft.EntityFrameworkCore;
using Repositories.Context;
using YourProject.Worker;

namespace RemoveMembership
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = Host.CreateApplicationBuilder(args);
            builder.Configuration.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);

            // Add DbContext (same as API)
            builder.Services.AddDbContext<TourmateContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

            // Add your worker with proper scoped service handling
            builder.Services.AddScoped<RemoveMembership>();
            builder.Services.AddHostedService<RemoveMembershipService>();
            var host = builder.Build();
            host.Run();
        }
    }
}