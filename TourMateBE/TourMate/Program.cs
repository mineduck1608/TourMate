﻿
// Add this to your Program.cs file in the Web API project
using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;
using Microsoft.EntityFrameworkCore;
using Net.payOS;
using Repositories.Context;
using Repositories.Repository;
using Services;
using Services.Utils;
using Services.VnPay;
using System.Text.Json.Serialization;
using TourMate.MessageHub;
using TourMate.Mappings;





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
builder.Services.AddSignalR()
    .AddAzureSignalR(builder.Configuration["Azure:SignalR:ConnectionString"]!);

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



var app = builder.Build();

// Bật CORS trước khi routing
app.UseCors("AllowReactApp");

app.UseRouting();

app.UseAuthorization();

app.UseEndpoints(endpoints =>
{
    endpoints.MapHub<ChatHub>("/chatHub");
    endpoints.MapControllers();
});

app.UseSwagger();
app.UseSwaggerUI();
app.MapControllers();
app.Run();
