namespace WorkerService
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = Host.CreateApplicationBuilder(args);
            builder.Services.AddScoped<RemoveMembership>();
            builder.Services.AddHostedService<RemoveMembershipService>();

            var host = builder.Build();
            host.Run();
        }
    }
}