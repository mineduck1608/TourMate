using Microsoft.EntityFrameworkCore;
using Repositories.Context;
using Repositories.Repository;
using Services;
using Services.Utils;
using System;
using System.Text.Json.Serialization;
using TourMate.MessageHub;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddSignalR();

// Add this to your Program.cs file in the Web API project
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
builder.Services.AddScoped<TokenService>();

builder.Services.AddDbContext<TourmateContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins(
            "http://localhost:3000",          // localhost
            "https://tourmate-phi.vercel.app" // domain production
        )
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.Never;
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseRouting();

app.UseCors("AllowReactApp");

// Configure the HTTP request pipeline.
//if (app.Environment.IsDevelopment())
//{
app.UseSwagger();
    app.UseSwaggerUI();
//}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();


app.MapHub<ChatHub>("/chatHub");

app.Run();
