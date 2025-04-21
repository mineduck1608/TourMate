using Microsoft.EntityFrameworkCore;
using Repositories.Repository;
using Repositories.Context;
using Services;
using System;
using TourMate.Utils;

var builder = WebApplication.CreateBuilder(args);

// Add this to your Program.cs file in the Web API project
builder.Services.AddScoped<AccountRepository>();
builder.Services.AddScoped<IAccountService, AccountService>();

builder.Services.AddScoped<AccountMembershipRepository>();
builder.Services.AddScoped<IAccountMembershipService, AccountMembershipService>();

builder.Services.AddScoped<ActiveAreaRepository>();
builder.Services.AddScoped<IActiveAreaService, ActiveAreaService>();

builder.Services.AddScoped<BidRepository>();
builder.Services.AddScoped<IBidService, BidService>();

builder.Services.AddScoped<BlogRepository>();
builder.Services.AddScoped<IBlogService, BlogService>();

builder.Services.AddScoped<BlogCommentRepository>();
builder.Services.AddScoped<IBlogCommentService, BlogCommentService>();

builder.Services.AddScoped<BlogCommentReplyRepository>();
builder.Services.AddScoped<IBlogCommentReplyService, BlogCommentReplyService>();

builder.Services.AddScoped<BlogLikeRepository>();
builder.Services.AddScoped<IBlogLikeService, BlogLikeService>();

builder.Services.AddScoped<CategoryRepository>();
builder.Services.AddScoped<ICategoryService, CategoryService>();

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

builder.Services.AddScoped<NewsCategoryRepository>();
builder.Services.AddScoped<INewsCategoryService, NewsCategoryService>();

builder.Services.AddScoped<NewsCommentsRepository>();
builder.Services.AddScoped<INewsCommentsService, NewsCommentsService>();

builder.Services.AddScoped<NewsReplyRepository>();
builder.Services.AddScoped<INewsReplyService, NewsReplyService>();

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

builder.Services.AddDbContext<TourMateContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));



builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
