
// Add this to your Program.cs file in the Web API project
using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Net.payOS;
using Repositories.Context;
using Repositories.Repositories;
using Repositories.Repository;
using Services;
using Services.Utils;
using Services.VnPay;
using System.Text;
using System.Text.Json.Serialization;
using TourMate.Mappings;
using TourMate.MessageHub;





var builder = WebApplication.CreateBuilder(args);

// Đăng ký CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", builder =>
    {
        builder.WithOrigins(
            "http://localhost:3000",
            "https://tourmate-phi.vercel.app"
        )
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();
    });
});

// Đăng ký Azure SignalR Service
//builder.Services.AddSignalR().AddAzureSignalR(builder.Configuration["Azure:SignalR:ConnectionString"]!);

builder.Services.AddSignalR();

builder.Services.AddScoped<AccountRepository>();
builder.Services.AddScoped<IAccountService, AccountService>();

builder.Services.AddScoped<AccountMembershipRepository>();
builder.Services.AddScoped<IAccountMembershipService, AccountMembershipService>();

builder.Services.AddScoped<ActiveAreaRepository>();
builder.Services.AddScoped<IActiveAreaService, ActiveAreaService>();

builder.Services.AddScoped<BidRepository>();
builder.Services.AddScoped<IBidService, BidService>();

builder.Services.AddScoped<ContactRepository>();
builder.Services.AddScoped<IContactService, ContactService>();

builder.Services.AddScoped<ConversationRepository>();
builder.Services.AddScoped<IConversationService, ConversationService>();

builder.Services.AddScoped<CustomerRepository>();
builder.Services.AddScoped<ICustomerService, CustomerService>();

builder.Services.AddScoped<CvapplicationRepository>();
builder.Services.AddScoped<ICvapplicationService, CvapplicationService>();

builder.Services.AddScoped<FeedbackRepository>();
builder.Services.AddScoped<IFeedbackService, FeedbackService>();

builder.Services.AddScoped<InvoiceRepository>();
builder.Services.AddScoped<IInvoiceService, InvoiceService>();

builder.Services.AddScoped<MembershipPackagesRepository>();
builder.Services.AddScoped<IMembershipPackagesService, MembershipPackagesService>();

builder.Services.AddScoped<MessagesRepository>();
builder.Services.AddScoped<IMessagesService, MessagesService>();

builder.Services.AddScoped<NewsRepository>();
builder.Services.AddScoped<INewsService, NewsService>();

builder.Services.AddScoped<PaymentsRepository>();
builder.Services.AddScoped<IPaymentsService, PaymentsService>();

builder.Services.AddScoped<RefreshTokenRepository>();
builder.Services.AddScoped<IRefreshTokenService, RefreshTokenService>();

builder.Services.AddScoped<RoleRepository>();
builder.Services.AddScoped<IRoleService, RoleService>();

builder.Services.AddScoped<SystemRevenueRepository>();
builder.Services.AddScoped<ISystemRevenueService, SystemRevenueService>();

builder.Services.AddScoped<TourBidRepository>();
builder.Services.AddScoped<ITourBidService, TourBidService>();

builder.Services.AddScoped<TourGuideRepository>();
builder.Services.AddScoped<ITourGuideService, TourGuideService>();

builder.Services.AddScoped<TourGuideDescRepository>();
builder.Services.AddScoped<ITourGuideDescService, TourGuideDescService>();

builder.Services.AddScoped<TourGuideRevenueRepository>();
builder.Services.AddScoped<ITourGuideRevenueService, TourGuideRevenueService>();

builder.Services.AddScoped<TourServicesRepository>();
builder.Services.AddScoped<ITourServicesService, TourServicesService>();

builder.Services.AddScoped<RevenueRepository>();
builder.Services.AddScoped<IRevenueService, RevenueService>();

builder.Services.AddScoped<AdminDashboardRepository>();
builder.Services.AddScoped<IAdminDashboardService, AdminDashboardService>();

builder.Services.AddScoped<PlatformFeedbackRepository>();
builder.Services.AddScoped<IPlatformFeedbackService, PlatformFeedbackService>();

builder.Services.AddScoped<TokenService>();

builder.Services.AddScoped<IEmailSender, EmailSender>();
builder.Services.AddScoped<IVnPayService, VnPayService>();
builder.Services.AddScoped<VnPayLibrary>();

// AutoMapper
builder.Services.AddAutoMapper(typeof(RevenueProfile));
builder.Services.AddScoped<TourBidCommentRepository>();
builder.Services.AddScoped<ITourBidCommentService, TourBidCommentService>();


// Đăng ký DbContext
builder.Services.AddDbContext<TourmateContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.Never;
});

//if (FirebaseApp.DefaultInstance == null)
//{
//    FirebaseApp.Create(new AppOptions()
//    {
//        Credential = GoogleCredential.FromFile("firebase-adminsdk.json")
//    });
//}

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddSingleton(sp =>
{
    var config = builder.Configuration.GetSection("PayOS");
    var clientId = config["ClientId"];
    var apiKey = config["ApiKey"];
    var checksumKey = config["ChecksumKey"];
    return new PayOS(clientId!, apiKey!, checksumKey!);
});


builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer("Bearer", options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                builder.Configuration["Jwt:Key"] ?? throw new Exception("JWT Key missing"))),
            ClockSkew = TimeSpan.Zero // ⚠️ Token hết hạn chính xác, không cho phép chênh lệch 5 phút
        };
    });

var app = builder.Build();

// Bật CORS trước khi routing
app.UseCors("AllowReactApp");

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.UseEndpoints(endpoints =>
{
    endpoints.MapHub<ChatHub>("/chatHub");
    endpoints.MapControllers();
});

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapControllers();
app.Run();
