
// Add this to your Program.cs file in the Web API project
using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Net.payOS;
using Repositories.Context;
using Repositories.GenericRepository;
using Repositories.Repositories;
using Repositories.IRepositories;
using Services.IServices;
using Services.Services;
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
builder.Services.AddSignalR().AddAzureSignalR(builder.Configuration["Azure:SignalR:ConnectionString"]!);

//builder.Services.AddSignalR();

builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));


builder.Services.AddScoped<IAccountRepository, AccountRepository>();
builder.Services.AddScoped<IAccountService, AccountService>();

builder.Services.AddScoped<IAccountMembershipRepository, AccountMembershipRepository>();
builder.Services.AddScoped<IAccountMembershipService, AccountMembershipService>();

builder.Services.AddScoped<IActiveAreaRepository, ActiveAreaRepository>();
builder.Services.AddScoped<IActiveAreaService, ActiveAreaService>();

builder.Services.AddScoped<IBidRepository, BidRepository>();
builder.Services.AddScoped<IBidService, BidService>();

builder.Services.AddScoped<IContactRepository, ContactRepository>();
builder.Services.AddScoped<IContactService, ContactService>();

builder.Services.AddScoped<IConversationRepository, ConversationRepository>();
builder.Services.AddScoped<IConversationService, ConversationService>();

builder.Services.AddScoped<ICustomerRepository, CustomerRepository>();
builder.Services.AddScoped<ICustomerService, CustomerService>();

builder.Services.AddScoped<ICvapplicationRepository, CvapplicationRepository>();
builder.Services.AddScoped<ICvapplicationService, CvapplicationService>();

builder.Services.AddScoped<IFeedbackRepository, FeedbackRepository>();
builder.Services.AddScoped<IFeedbackService, FeedbackService>();

builder.Services.AddScoped<IInvoiceRepository, InvoiceRepository>();
builder.Services.AddScoped<IInvoiceService, InvoiceService>();

builder.Services.AddScoped<IMembershipPackagesRepository, MembershipPackagesRepository>();
builder.Services.AddScoped<IMembershipPackagesService, MembershipPackagesService>();

builder.Services.AddScoped<IMessagesRepository, MessagesRepository>();
builder.Services.AddScoped<IMessagesService, MessagesService>();

builder.Services.AddScoped<INewsRepository, NewsRepository>();
builder.Services.AddScoped<INewsService, NewsService>();

builder.Services.AddScoped<IPaymentsRepository, PaymentsRepository>();
builder.Services.AddScoped<IPaymentsService, PaymentsService>();

builder.Services.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();
builder.Services.AddScoped<IRefreshTokenService, RefreshTokenService>();

builder.Services.AddScoped<IRoleRepository, RoleRepository>();
builder.Services.AddScoped<IRoleService, RoleService>();

builder.Services.AddScoped<ITourBidRepository, TourBidRepository>();
builder.Services.AddScoped<ITourBidService, TourBidService>();

builder.Services.AddScoped<ITourGuideRepository, TourGuideRepository>();
builder.Services.AddScoped<ITourGuideService, TourGuideService>();

builder.Services.AddScoped<ITourGuideDescRepository, TourGuideDescRepository>();
builder.Services.AddScoped<ITourGuideDescService, TourGuideDescService>();

builder.Services.AddScoped<ITourServicesRepository, TourServicesRepository>();
builder.Services.AddScoped<ITourServicesService, TourServicesService>();

builder.Services.AddScoped<IRevenueRepository, RevenueRepository>();
builder.Services.AddScoped<IRevenueService, RevenueService>();

builder.Services.AddScoped<IAdminDashboardRepository, AdminDashboardRepository>();
builder.Services.AddScoped<IAdminDashboardService, AdminDashboardService>();

builder.Services.AddScoped<IPlatformFeedbackRepository, PlatformFeedbackRepository>();
builder.Services.AddScoped<IPlatformFeedbackService, PlatformFeedbackService>();

builder.Services.AddScoped<ITourBidCommentRepository, TourBidCommentRepository>();
builder.Services.AddScoped<ITourBidCommentService, TourBidCommentService>();

builder.Services.AddScoped<TokenService>();

builder.Services.AddScoped<IEmailSender, EmailSender>();
builder.Services.AddScoped<IVnPayService, VnPayService>();
builder.Services.AddScoped<VnPayLibrary>();

// AutoMapper
builder.Services.AddAutoMapper(typeof(RevenueProfile));



// Đăng ký DbContext
builder.Services.AddDbContext<TourmateContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.Never;
});

if (FirebaseApp.DefaultInstance == null)
{
    FirebaseApp.Create(new AppOptions()
    {
        Credential = GoogleCredential.FromFile("firebase-adminsdk.json")
    });
}

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "TourMate API", Version = "v1" });

    // Add JWT Bearer definition
    c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "Enter your JWT Bearer token in this format: Bearer {your token here}"
    });

    c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});


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
    //endpoints.MapHub<ChatHub>("/chatHub");
    endpoints.MapControllers();
});

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapControllers();
app.Run();
