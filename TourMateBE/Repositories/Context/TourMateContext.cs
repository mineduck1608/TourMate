﻿using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Repositories.Models;
using System;
using System.Collections.Generic;

namespace Repositories.Context;

public partial class TourmateContext : DbContext
{
    public TourmateContext()
    {
    }

    public TourmateContext(DbContextOptions<TourmateContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Account> Accounts { get; set; }

    public virtual DbSet<AccountMembership> AccountMemberships { get; set; }

    public virtual DbSet<ActiveArea> ActiveAreas { get; set; }

    public virtual DbSet<Bid> Bids { get; set; }

    public virtual DbSet<Contact> Contacts { get; set; }

    public virtual DbSet<Conversation> Conversations { get; set; }

    public virtual DbSet<Customer> Customers { get; set; }

    public virtual DbSet<Cvapplication> Cvapplications { get; set; }

    public virtual DbSet<Feedback> Feedbacks { get; set; }

    public virtual DbSet<Invoice> Invoices { get; set; }

    public virtual DbSet<MembershipPackage> MembershipPackages { get; set; }

    public virtual DbSet<Message> Messages { get; set; }

    public virtual DbSet<MessageType> MessageTypes { get; set; }

    public virtual DbSet<News> News { get; set; }

    public virtual DbSet<Payment> Payments { get; set; }

    public virtual DbSet<RefreshToken> RefreshTokens { get; set; }

    public virtual DbSet<Revenue> Revenues { get; set; }

    public virtual DbSet<Role> Roles { get; set; }

    public virtual DbSet<SystemRevenue> SystemRevenues { get; set; }

    public virtual DbSet<TourBid> TourBids { get; set; }

    public virtual DbSet<TourBidComment> TourBidComments { get; set; }

    public virtual DbSet<TourGuide> TourGuides { get; set; }

    public virtual DbSet<TourGuideDesc> TourGuideDescs { get; set; }

    public virtual DbSet<TourGuideRevenue> TourGuideRevenues { get; set; }

    public virtual DbSet<TourService> TourServices { get; set; }

    public virtual DbSet<UserLikeBid> UserLikeBids { get; set; }

    public static string GetConnectionString(string connectionStringName)
    {
        var config = new ConfigurationBuilder()
            .SetBasePath(AppDomain.CurrentDomain.BaseDirectory)
            .AddJsonFile("appsettings.json")
            .Build();
        string connectionString = config.GetConnectionString(connectionStringName);
        return connectionString;
    }
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
       => optionsBuilder.UseSqlServer(GetConnectionString("DefaultConnection"));

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Account>(entity =>
        {
            entity.HasKey(e => e.AccountId).HasName("PK__Account__F267251E65A5A5B9");

            entity.ToTable("Account");

            entity.HasIndex(e => e.RoleId, "IX_Account_roleId");

            entity.HasIndex(e => e.Email, "UQ__Account__AB6E616407035DCA").IsUnique();

            entity.Property(e => e.AccountId).HasColumnName("accountId");
            entity.Property(e => e.CreatedDate)
                .HasColumnType("datetime")
                .HasColumnName("createdDate");
            entity.Property(e => e.Email)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("email");
            entity.Property(e => e.Password)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("password");
            entity.Property(e => e.RoleId).HasColumnName("roleId");
            entity.Property(e => e.Status).HasColumnName("status");

            entity.HasOne(d => d.Role).WithMany(p => p.Accounts)
                .HasForeignKey(d => d.RoleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FKAccount946763");
        });

        modelBuilder.Entity<AccountMembership>(entity =>
        {
            entity.HasKey(e => e.AccountMembershipId).HasName("PK__AccountM__1C86D62900EA66B9");

            entity.ToTable("AccountMembership");

            entity.HasIndex(e => e.AccountId, "IX_AccountMembership_accountId");

            entity.HasIndex(e => e.MembershipPackageId, "IX_AccountMembership_membershipPackageId");

            entity.Property(e => e.AccountMembershipId).HasColumnName("accountMembershipId");
            entity.Property(e => e.AccountId).HasColumnName("accountId");
            entity.Property(e => e.EndDate).HasColumnName("endDate");
            entity.Property(e => e.IsActive).HasColumnName("isActive");
            entity.Property(e => e.MembershipPackageId).HasColumnName("membershipPackageId");
            entity.Property(e => e.StartDate).HasColumnName("startDate");

            entity.HasOne(d => d.Account).WithMany(p => p.AccountMemberships)
                .HasForeignKey(d => d.AccountId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FKAccountMem798455");

            entity.HasOne(d => d.MembershipPackage).WithMany(p => p.AccountMemberships)
                .HasForeignKey(d => d.MembershipPackageId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FKAccountMem974204");
        });

        modelBuilder.Entity<ActiveArea>(entity =>
        {
            entity.HasKey(e => e.AreaId).HasName("PK__ActiveAr__52936C57F06B6800");

            entity.ToTable("ActiveArea");

            entity.Property(e => e.AreaId).HasColumnName("areaId");
            entity.Property(e => e.AreaContent).HasColumnName("areaContent");
            entity.Property(e => e.AreaName)
                .HasMaxLength(255)
                .HasColumnName("areaName");
            entity.Property(e => e.AreaSubtitle)
                .HasMaxLength(255)
                .HasColumnName("areaSubtitle");
            entity.Property(e => e.AreaTitle)
                .HasMaxLength(255)
                .HasColumnName("areaTitle");
            entity.Property(e => e.AreaType)
                .HasMaxLength(50)
                .HasColumnName("areaType");
            entity.Property(e => e.BannerImg)
                .HasMaxLength(255)
                .HasColumnName("bannerImg");
            entity.Property(e => e.CreatedAt)
                .HasColumnType("datetime")
                .HasColumnName("createdAt");
        });

        modelBuilder.Entity<Bid>(entity =>
        {
            entity.HasKey(e => e.BidId).HasName("PK__Bid__48E98F58BE5BA5ED");

            entity.ToTable("Bid");

            entity.HasIndex(e => e.TourBidId, "IX_Bid_tourBidId");

            entity.HasIndex(e => e.TourGuideId, "IX_Bid_tourGuideId");

            entity.Property(e => e.BidId).HasColumnName("bidId");
            entity.Property(e => e.Amount).HasColumnName("amount");
            entity.Property(e => e.Comment).HasColumnName("comment");
            entity.Property(e => e.CreatedAt)
                .HasColumnType("datetime")
                .HasColumnName("createdAt");
            entity.Property(e => e.Status)
                .HasMaxLength(255)
                .HasColumnName("status");
            entity.Property(e => e.TourBidId).HasColumnName("tourBidId");
            entity.Property(e => e.TourGuideId).HasColumnName("tourGuideId");

            entity.HasOne(d => d.TourBid).WithMany(p => p.Bids)
                .HasForeignKey(d => d.TourBidId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FKBid659809");

            entity.HasOne(d => d.TourGuide).WithMany(p => p.Bids)
                .HasForeignKey(d => d.TourGuideId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FKBid623728");
        });

        modelBuilder.Entity<Contact>(entity =>
        {
            entity.HasKey(e => e.ContactId).HasName("PK__Contact__7121FD3547A83250");

            entity.ToTable("Contact");

            entity.Property(e => e.ContactId).HasColumnName("contactId");
            entity.Property(e => e.Content).HasColumnName("content");
            entity.Property(e => e.CreatedAt)
                .HasColumnType("datetime")
                .HasColumnName("createdAt");
            entity.Property(e => e.Email)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("email");
            entity.Property(e => e.FullName)
                .HasMaxLength(255)
                .HasColumnName("fullName");
            entity.Property(e => e.IsProcessed).HasColumnName("isProcessed");
            entity.Property(e => e.Phone)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("phone");
            entity.Property(e => e.Title)
                .HasMaxLength(255)
                .HasColumnName("title");
        });

        modelBuilder.Entity<Conversation>(entity =>
        {
            entity.HasKey(e => e.ConversationId).HasName("PK__Conversa__6952075FAC24F669");

            entity.ToTable("Conversation");

            entity.HasIndex(e => e.Account1Id, "IX_Conversation_account1Id");

            entity.HasIndex(e => e.Account2Id, "IX_Conversation_account2Id");

            entity.Property(e => e.ConversationId).HasColumnName("conversationId");
            entity.Property(e => e.Account1Id).HasColumnName("account1Id");
            entity.Property(e => e.Account2Id).HasColumnName("account2Id");
            entity.Property(e => e.CreatedAt)
                .HasColumnType("datetime")
                .HasColumnName("createdAt");

            entity.HasOne(d => d.Account1).WithMany(p => p.ConversationAccount1s)
                .HasForeignKey(d => d.Account1Id)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FKConversati600223");

            entity.HasOne(d => d.Account2).WithMany(p => p.ConversationAccount2s)
                .HasForeignKey(d => d.Account2Id)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FKConversati599262");
        });

        modelBuilder.Entity<Customer>(entity =>
        {
            entity.HasKey(e => e.CustomerId).HasName("PK__Customer__B611CB7D37AFB881");

            entity.ToTable("Customer");

            entity.HasIndex(e => e.AccountId, "IX_Customer_accountId");

            entity.HasIndex(e => e.Phone, "UQ__Customer__B43B145F0C731CC2").IsUnique();

            entity.Property(e => e.CustomerId).HasColumnName("customerId");
            entity.Property(e => e.AccountId).HasColumnName("accountId");
            entity.Property(e => e.DateOfBirth).HasColumnName("dateOfBirth");
            entity.Property(e => e.FullName)
                .HasMaxLength(50)
                .HasColumnName("fullName");
            entity.Property(e => e.Gender)
                .HasMaxLength(10)
                .HasColumnName("gender");
            entity.Property(e => e.Image)
                .HasMaxLength(255)
                .HasColumnName("image");
            entity.Property(e => e.Phone)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("phone");

            entity.HasOne(d => d.Account).WithMany(p => p.Customers)
                .HasForeignKey(d => d.AccountId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FKCustomer62882");
        });

        modelBuilder.Entity<Cvapplication>(entity =>
        {
            entity.HasKey(e => e.CvApplicationId).HasName("PK__CVApplic__F753C8A2C60BA95C");

            entity.ToTable("CVApplication");

            entity.Property(e => e.CvApplicationId).HasColumnName("cvApplicationId");
            entity.Property(e => e.Address)
                .HasMaxLength(255)
                .HasColumnName("address");
            entity.Property(e => e.CreatedAt)
                .HasColumnType("datetime")
                .HasColumnName("createdAt");
            entity.Property(e => e.DateOfBirth).HasColumnName("dateOfBirth");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.Email)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("email");
            entity.Property(e => e.FullName)
                .HasMaxLength(255)
                .HasColumnName("fullName");
            entity.Property(e => e.Gender)
                .HasMaxLength(50)
                .HasColumnName("gender");
            entity.Property(e => e.Image)
                .HasMaxLength(255)
                .HasColumnName("image");
            entity.Property(e => e.Link)
                .HasMaxLength(255)
                .HasColumnName("link");
            entity.Property(e => e.Phone)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("phone");
            entity.Property(e => e.Response).HasColumnName("response");
            entity.Property(e => e.Status)
                .HasMaxLength(50)
                .HasColumnName("status");
        });

        modelBuilder.Entity<Feedback>(entity =>
        {
            entity.HasKey(e => e.FeedbackId).HasName("PK__Feedback__2613FD24C69BCF34");

            entity.ToTable("Feedback");

            entity.HasIndex(e => e.CustomerId, "IX_Feedback_customerId");

            entity.HasIndex(e => e.TourGuideId, "IX_Feedback_tourGuideId");

            entity.Property(e => e.FeedbackId).HasColumnName("feedbackId");
            entity.Property(e => e.Content).HasColumnName("content");
            entity.Property(e => e.CreatedDate)
                .HasColumnType("datetime")
                .HasColumnName("createdDate");
            entity.Property(e => e.CustomerId).HasColumnName("customerId");
            entity.Property(e => e.IsDeleted).HasColumnName("isDeleted");
            entity.Property(e => e.Rating).HasColumnName("rating");
            entity.Property(e => e.TourGuideId).HasColumnName("tourGuideId");
            entity.Property(e => e.UpdatedAt)
                .HasColumnType("datetime")
                .HasColumnName("updatedAt");

            entity.HasOne(d => d.Customer).WithMany(p => p.Feedbacks)
                .HasForeignKey(d => d.CustomerId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FKFeedback561761");

            entity.HasOne(d => d.TourGuide).WithMany(p => p.Feedbacks)
                .HasForeignKey(d => d.TourGuideId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FKFeedback699513");
        });

        modelBuilder.Entity<Invoice>(entity =>
        {
            entity.HasKey(e => e.InvoiceId).HasName("PK__Invoice__1252416C1CC20425");

            entity.ToTable("Invoice");

            entity.HasIndex(e => e.AreaId, "IX_Invoice_areaId");

            entity.HasIndex(e => e.CustomerId, "IX_Invoice_customerId");

            entity.HasIndex(e => e.TourGuideId, "IX_Invoice_tourGuideId");

            entity.Property(e => e.InvoiceId).HasColumnName("invoiceId");
            entity.Property(e => e.AreaId).HasColumnName("areaId");
            entity.Property(e => e.CreatedDate)
                .HasColumnType("datetime")
                .HasColumnName("createdDate");
            entity.Property(e => e.CustomerId).HasColumnName("customerId");
            entity.Property(e => e.CustomerPhone)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("customerPhone");
            entity.Property(e => e.EndDate)
                .HasColumnType("datetime")
                .HasColumnName("endDate");
            entity.Property(e => e.Note).HasColumnName("note");
            entity.Property(e => e.PeopleAmount)
                .HasMaxLength(255)
                .HasColumnName("peopleAmount");
            entity.Property(e => e.Price).HasColumnName("price");
            entity.Property(e => e.StartDate)
                .HasColumnType("datetime")
                .HasColumnName("startDate");
            entity.Property(e => e.Status)
                .HasMaxLength(50)
                .HasColumnName("status");
            entity.Property(e => e.TourDesc).HasColumnName("tourDesc");
            entity.Property(e => e.TourGuideId).HasColumnName("tourGuideId");
            entity.Property(e => e.TourName)
                .HasMaxLength(255)
                .HasColumnName("tourName");

            entity.HasOne(d => d.Area).WithMany(p => p.Invoices)
                .HasForeignKey(d => d.AreaId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FKInvoice643155");

            entity.HasOne(d => d.Customer).WithMany(p => p.Invoices)
                .HasForeignKey(d => d.CustomerId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FKInvoice303466");

            entity.HasOne(d => d.TourGuide).WithMany(p => p.Invoices)
                .HasForeignKey(d => d.TourGuideId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FKInvoice441218");
        });

        modelBuilder.Entity<MembershipPackage>(entity =>
        {
            entity.HasKey(e => e.MembershipPackageId).HasName("PK__Membersh__FC12A45490CC784A");

            entity.ToTable("MembershipPackage");

            entity.Property(e => e.MembershipPackageId).HasColumnName("membershipPackageId");
            entity.Property(e => e.BenefitDesc).HasColumnName("benefitDesc");
            entity.Property(e => e.Duration)
                .HasComment("in day")
                .HasColumnName("duration");
            entity.Property(e => e.Name)
                .HasMaxLength(255)
                .HasColumnName("name");
            entity.Property(e => e.Price).HasColumnName("price");
        });

        modelBuilder.Entity<Message>(entity =>
        {
            entity.HasKey(e => e.MessageId).HasName("PK__Message__4808B993E22CC7F8");

            entity.ToTable("Message");

            entity.HasIndex(e => e.ConversationId, "IX_Message_conversationId");

            entity.HasIndex(e => e.SenderId, "IX_Message_senderId");

            entity.Property(e => e.MessageId).HasColumnName("messageId");
            entity.Property(e => e.ConversationId).HasColumnName("conversationId");
            entity.Property(e => e.IsDeleted).HasColumnName("isDeleted");
            entity.Property(e => e.IsEdited).HasColumnName("isEdited");
            entity.Property(e => e.IsRead).HasColumnName("isRead");
            entity.Property(e => e.MessageText).HasColumnName("messageText");
            entity.Property(e => e.MessageTypeId).HasDefaultValue(1);
            entity.Property(e => e.SendAt)
                .HasColumnType("datetime")
                .HasColumnName("sendAt");
            entity.Property(e => e.SenderId).HasColumnName("senderId");

            entity.HasOne(d => d.Conversation).WithMany(p => p.Messages)
                .HasForeignKey(d => d.ConversationId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FKMessage780995");

            entity.HasOne(d => d.MessageType).WithMany(p => p.Messages)
                .HasForeignKey(d => d.MessageTypeId)
                .HasConstraintName("FK_Message_MessageType");

            entity.HasOne(d => d.Sender).WithMany(p => p.Messages)
                .HasForeignKey(d => d.SenderId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FKMessage122587");
        });

        modelBuilder.Entity<MessageType>(entity =>
        {
            entity.HasKey(e => e.MessageTypeId).HasName("PK__MessageT__9BA1E2BA3A60699E");

            entity.ToTable("MessageType");

            entity.Property(e => e.TypeName).HasMaxLength(50);
        });

        modelBuilder.Entity<News>(entity =>
        {
            entity.HasKey(e => e.NewsId).HasName("PK__News__5218041EEEAAB71A");

            entity.Property(e => e.NewsId).HasColumnName("newsId");
            entity.Property(e => e.BannerImg)
                .HasMaxLength(255)
                .HasColumnName("bannerImg");
            entity.Property(e => e.Category)
                .HasMaxLength(255)
                .HasColumnName("category");
            entity.Property(e => e.Content).HasColumnName("content");
            entity.Property(e => e.CreatedAt)
                .HasColumnType("datetime")
                .HasColumnName("createdAt");
            entity.Property(e => e.Title)
                .HasMaxLength(255)
                .HasColumnName("title");
        });

        modelBuilder.Entity<Payment>(entity =>
        {
            entity.HasKey(e => e.PaymentId).HasName("PK__Payment__A0D9EFC638C72549");

            entity.ToTable("Payment");

            entity.HasIndex(e => e.AccountId, "IX_Payment_accountId");

            entity.HasIndex(e => e.InvoiceId, "IX_Payment_invoiceId");

            entity.HasIndex(e => e.MembershipPackageId, "IX_Payment_membershipPackageId");

            entity.Property(e => e.PaymentId).HasColumnName("paymentId");
            entity.Property(e => e.AccountId).HasColumnName("accountId");
            entity.Property(e => e.CompleteDate)
                .HasColumnType("datetime")
                .HasColumnName("completeDate");
            entity.Property(e => e.InvoiceId).HasColumnName("invoiceId");
            entity.Property(e => e.MembershipPackageId).HasColumnName("membershipPackageId");
            entity.Property(e => e.PaymentMethod)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasComment("momo/ vnpay")
                .HasColumnName("paymentMethod");
            entity.Property(e => e.PaymentType)
                .HasMaxLength(50)
                .HasComment("membership / invoice")
                .HasColumnName("paymentType");
            entity.Property(e => e.Price).HasColumnName("price");
            entity.Property(e => e.Status)
                .HasMaxLength(50)
                .HasColumnName("status");

            entity.HasOne(d => d.Account).WithMany(p => p.Payments)
                .HasForeignKey(d => d.AccountId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FKPayment215705");

            entity.HasOne(d => d.Invoice).WithMany(p => p.Payments)
                .HasForeignKey(d => d.InvoiceId)
                .HasConstraintName("FKPayment939394");

            entity.HasOne(d => d.MembershipPackage).WithMany(p => p.Payments)
                .HasForeignKey(d => d.MembershipPackageId)
                .HasConstraintName("FKPayment16775");
        });

        modelBuilder.Entity<RefreshToken>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__RefreshT__3213E83F144396AD");

            entity.ToTable("RefreshToken");

            entity.HasIndex(e => e.UserId, "IX_RefreshToken_userId");

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("id");
            entity.Property(e => e.CreatedAt)
                .HasColumnType("datetime")
                .HasColumnName("createdAt");
            entity.Property(e => e.ExpireAt)
                .HasColumnType("datetime")
                .HasColumnName("expireAt");
            entity.Property(e => e.IsRevoked).HasColumnName("isRevoked");
            entity.Property(e => e.Token)
                .HasMaxLength(255)
                .HasColumnName("token");
            entity.Property(e => e.UserId).HasColumnName("userId");

            entity.HasOne(d => d.User).WithMany(p => p.RefreshTokens)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FKRefreshTok914650");
        });

        modelBuilder.Entity<Revenue>(entity =>
        {
            entity.HasKey(e => e.RevenueId).HasName("PK__Revenue__275F16DDB67A94B6");

            entity.ToTable("Revenue");

            entity.Property(e => e.ActualReceived).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.PlatformCommission).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.TotalAmount).HasColumnType("decimal(18, 2)");

            entity.HasOne(d => d.TourGuide).WithMany(p => p.Revenues)
                .HasForeignKey(d => d.TourGuideId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Revenue_TourGuide");
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(e => e.RoleId).HasName("PK__Role__CD98462A1DFD6468");

            entity.ToTable("Role");

            entity.Property(e => e.RoleId).HasColumnName("roleId");
            entity.Property(e => e.RoleName)
                .HasMaxLength(50)
                .HasColumnName("roleName");
        });

        modelBuilder.Entity<SystemRevenue>(entity =>
        {
            entity.HasKey(e => e.SystemRevenueId).HasName("PK__SystemRe__EED5C17D12AE0E85");

            entity.ToTable("SystemRevenue");

            entity.HasIndex(e => e.PaymentId, "IX_SystemRevenue_paymentId");

            entity.Property(e => e.SystemRevenueId).HasColumnName("systemRevenueId");
            entity.Property(e => e.PaymentId).HasColumnName("paymentId");
            entity.Property(e => e.Value).HasColumnName("value");

            entity.HasOne(d => d.Payment).WithMany(p => p.SystemRevenues)
                .HasForeignKey(d => d.PaymentId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FKSystemReve708422");
        });

        modelBuilder.Entity<TourBid>(entity =>
        {
            entity.HasKey(e => e.TourBidId).HasName("PK__TourBid__6359293A7C00C65F");

            entity.ToTable("TourBid");

            entity.HasIndex(e => e.AccountId, "IX_TourBid_accountId");

            entity.HasIndex(e => e.PlaceRequested, "IX_TourBid_placeRequested");

            entity.Property(e => e.TourBidId).HasColumnName("tourBidId");
            entity.Property(e => e.AccountId).HasColumnName("accountId");
            entity.Property(e => e.Content).HasColumnName("content");
            entity.Property(e => e.CreatedAt)
                .HasColumnType("datetime")
                .HasColumnName("createdAt");
            entity.Property(e => e.IsDeleted).HasColumnName("isDeleted");
            entity.Property(e => e.MaxPrice).HasColumnName("maxPrice");
            entity.Property(e => e.PlaceRequested).HasColumnName("placeRequested");
            entity.Property(e => e.Status)
                .HasMaxLength(10)
                .HasColumnName("status");
            entity.Property(e => e.UpdatedAt)
                .HasColumnType("datetime")
                .HasColumnName("updatedAt");

            entity.HasOne(d => d.Account).WithMany(p => p.TourBids)
                .HasForeignKey(d => d.AccountId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FKTourBid491964");

            entity.HasOne(d => d.PlaceRequestedNavigation).WithMany(p => p.TourBids)
                .HasForeignKey(d => d.PlaceRequested)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FKTourBid682696");
        });

        modelBuilder.Entity<TourBidComment>(entity =>
        {
            entity.HasKey(e => e.CommentId).HasName("PK__TourBidC__CDDE919DBDFA69C7");

            entity.ToTable("TourBidComment");

            entity.Property(e => e.CommentId).HasColumnName("commentId");
            entity.Property(e => e.AccountId).HasColumnName("accountId");
            entity.Property(e => e.Content)
                .HasMaxLength(255)
                .HasColumnName("content");
            entity.Property(e => e.CreatedAt)
                .HasColumnType("datetime")
                .HasColumnName("createdAt");
            entity.Property(e => e.IsDeleted).HasColumnName("isDeleted");
            entity.Property(e => e.TourBidId).HasColumnName("tourBidId");

            entity.HasOne(d => d.Account).WithMany(p => p.TourBidComments)
                .HasForeignKey(d => d.AccountId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FKTourBidCom910846");

            entity.HasOne(d => d.TourBid).WithMany(p => p.TourBidComments)
                .HasForeignKey(d => d.TourBidId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FKTourBidCom405023");
        });

        modelBuilder.Entity<TourGuide>(entity =>
        {
            entity.HasKey(e => e.TourGuideId).HasName("PK__TourGuid__D466D4A2812B0FFF");

            entity.ToTable("TourGuide");

            entity.HasIndex(e => e.AccountId, "IX_TourGuide_accountId");

            entity.HasIndex(e => e.Phone, "UQ__TourGuid__B43B145FCB2C42A1").IsUnique();

            entity.Property(e => e.TourGuideId).HasColumnName("tourGuideId");
            entity.Property(e => e.AccountId).HasColumnName("accountId");
            entity.Property(e => e.Address)
                .HasMaxLength(255)
                .HasColumnName("address");
            entity.Property(e => e.BannerImage)
                .HasDefaultValue(" ")
                .HasColumnName("bannerImage");
            entity.Property(e => e.DateOfBirth).HasColumnName("dateOfBirth");
            entity.Property(e => e.FullName)
                .HasMaxLength(50)
                .HasColumnName("fullName");
            entity.Property(e => e.Gender)
                .HasMaxLength(10)
                .HasColumnName("gender");
            entity.Property(e => e.Image)
                .HasMaxLength(255)
                .HasColumnName("image");
            entity.Property(e => e.Phone)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("phone");

            entity.HasOne(d => d.Account).WithMany(p => p.TourGuides)
                .HasForeignKey(d => d.AccountId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FKTourGuide28174");
        });

        modelBuilder.Entity<TourGuideDesc>(entity =>
        {
            entity.HasKey(e => e.TourGuideDescId).HasName("PK__TourGuid__5D853B513094440C");

            entity.ToTable("TourGuideDesc");

            entity.HasIndex(e => e.AreaId, "IX_TourGuideDesc_areaId");

            entity.HasIndex(e => e.TourGuideId, "IX_TourGuideDesc_tourGuideId");

            entity.Property(e => e.TourGuideDescId).HasColumnName("tourGuideDescId");
            entity.Property(e => e.AreaId).HasColumnName("areaId");
            entity.Property(e => e.Company)
                .HasMaxLength(255)
                .HasColumnName("company");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.TourGuideId).HasColumnName("tourGuideId");
            entity.Property(e => e.YearOfExperience).HasColumnName("yearOfExperience");

            entity.HasOne(d => d.Area).WithMany(p => p.TourGuideDescs)
                .HasForeignKey(d => d.AreaId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FKTourGuideD540188");

            entity.HasOne(d => d.TourGuide).WithMany(p => p.TourGuideDescs)
                .HasForeignKey(d => d.TourGuideId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FKTourGuideD742125");
        });

        modelBuilder.Entity<TourGuideRevenue>(entity =>
        {
            entity.HasKey(e => e.TourGuideRevenueId).HasName("PK__TourGuid__049615064CBEB05C");

            entity.ToTable("TourGuideRevenue");

            entity.HasIndex(e => e.PaymentId, "IX_TourGuideRevenue_paymentId");

            entity.HasIndex(e => e.TourGuideId, "IX_TourGuideRevenue_tourGuideId");

            entity.Property(e => e.TourGuideRevenueId).HasColumnName("tourGuideRevenueId");
            entity.Property(e => e.PaymentId).HasColumnName("paymentId");
            entity.Property(e => e.TourGuideId).HasColumnName("tourGuideId");
            entity.Property(e => e.Value).HasColumnName("value");

            entity.HasOne(d => d.Payment).WithMany(p => p.TourGuideRevenues)
                .HasForeignKey(d => d.PaymentId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FKTourGuideR890450");

            entity.HasOne(d => d.TourGuide).WithMany(p => p.TourGuideRevenues)
                .HasForeignKey(d => d.TourGuideId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FKTourGuideR267432");
        });

        modelBuilder.Entity<TourService>(entity =>
        {
            entity.HasKey(e => e.ServiceId).HasName("PK__TourServ__455070DF9BE25FB6");

            entity.ToTable("TourService");

            entity.HasIndex(e => e.TourGuideId, "IX_TourService_tourGuideId");

            entity.Property(e => e.ServiceId).HasColumnName("serviceId");
            entity.Property(e => e.Content).HasColumnName("content");
            entity.Property(e => e.CreatedDate).HasColumnName("createdDate");
            entity.Property(e => e.Duration).HasColumnName("duration");
            entity.Property(e => e.Image)
                .HasMaxLength(255)
                .HasColumnName("image");
            entity.Property(e => e.IsDeleted).HasColumnName("isDeleted");
            entity.Property(e => e.Price).HasColumnName("price");
            entity.Property(e => e.ServiceName)
                .HasMaxLength(255)
                .HasColumnName("serviceName");
            entity.Property(e => e.Title)
                .HasMaxLength(50)
                .HasDefaultValue("")
                .HasColumnName("title");
            entity.Property(e => e.TourDesc).HasColumnName("tourDesc");
            entity.Property(e => e.TourGuideId).HasColumnName("tourGuideId");

            entity.HasOne(d => d.TourGuide).WithMany(p => p.TourServices)
                .HasForeignKey(d => d.TourGuideId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FKTourServic281225");
        });

        modelBuilder.Entity<UserLikeBid>(entity =>
        {
            entity.HasKey(e => e.LikeId).HasName("PK__UserLike__4FC592DB5B73A8A1");

            entity.ToTable("UserLikeBid");

            entity.Property(e => e.LikeId).HasColumnName("likeId");
            entity.Property(e => e.AccountId).HasColumnName("accountId");
            entity.Property(e => e.TourBidId).HasColumnName("tourBidId");

            entity.HasOne(d => d.Account).WithMany(p => p.UserLikeBids)
                .HasForeignKey(d => d.AccountId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FKUserLikeBi622082");

            entity.HasOne(d => d.TourBid).WithMany(p => p.UserLikeBids)
                .HasForeignKey(d => d.TourBidId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FKUserLikeBi116259");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
