using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Repositories.Migrations
{
    /// <inheritdoc />
    public partial class InitMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ActiveArea",
                columns: table => new
                {
                    areaId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    areaName = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    areaTitle = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    areaSubtitle = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    areaContent = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    bannerImg = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__ActiveAr__52936C57F06B6800", x => x.areaId);
                });

            migrationBuilder.CreateTable(
                name: "Category",
                columns: table => new
                {
                    categoryId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    categoryName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Category__23CAF1D8903ECE86", x => x.categoryId);
                });

            migrationBuilder.CreateTable(
                name: "Contact",
                columns: table => new
                {
                    contactId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    fullName = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    phone = table.Column<string>(type: "varchar(10)", unicode: false, maxLength: 10, nullable: false),
                    email = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: false),
                    title = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    createdAt = table.Column<DateTime>(type: "datetime", nullable: false),
                    isProcessed = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Contact__7121FD3547A83250", x => x.contactId);
                });

            migrationBuilder.CreateTable(
                name: "CVApplication",
                columns: table => new
                {
                    cvApplicationId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    fullName = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    dateOfBirth = table.Column<DateOnly>(type: "date", nullable: false),
                    gender = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    address = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    email = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: false),
                    phone = table.Column<string>(type: "varchar(10)", unicode: false, maxLength: 10, nullable: false),
                    link = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    image = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    status = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__CVApplic__F753C8A2C60BA95C", x => x.cvApplicationId);
                });

            migrationBuilder.CreateTable(
                name: "MembershipPackage",
                columns: table => new
                {
                    membershipPackageId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    name = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    price = table.Column<float>(type: "real", nullable: false),
                    duration = table.Column<int>(type: "int", nullable: false, comment: "in day"),
                    benefitDesc = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Membersh__FC12A45490CC784A", x => x.membershipPackageId);
                });

            migrationBuilder.CreateTable(
                name: "News",
                columns: table => new
                {
                    newsId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    title = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    createdDate = table.Column<DateOnly>(type: "date", nullable: false),
                    isDeleted = table.Column<bool>(type: "bit", nullable: false),
                    content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    bannerImg = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__News__5218041EEEAAB71A", x => x.newsId);
                });

            migrationBuilder.CreateTable(
                name: "Role",
                columns: table => new
                {
                    roleId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    roleName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Role__CD98462A1DFD6468", x => x.roleId);
                });

            migrationBuilder.CreateTable(
                name: "NewsCategory",
                columns: table => new
                {
                    newsCategoryId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    categoryId = table.Column<int>(type: "int", nullable: false),
                    newsId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__NewsCate__33073C1715BC2B54", x => x.newsCategoryId);
                    table.ForeignKey(
                        name: "FKNewsCatego154935",
                        column: x => x.newsId,
                        principalTable: "News",
                        principalColumn: "newsId");
                    table.ForeignKey(
                        name: "FKNewsCatego674681",
                        column: x => x.categoryId,
                        principalTable: "Category",
                        principalColumn: "categoryId");
                });

            migrationBuilder.CreateTable(
                name: "Account",
                columns: table => new
                {
                    accountId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    email = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    password = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: true),
                    createdDate = table.Column<DateTime>(type: "datetime", nullable: false),
                    roleId = table.Column<int>(type: "int", nullable: false),
                    status = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Account__F267251E65A5A5B9", x => x.accountId);
                    table.ForeignKey(
                        name: "FKAccount946763",
                        column: x => x.roleId,
                        principalTable: "Role",
                        principalColumn: "roleId");
                });

            migrationBuilder.CreateTable(
                name: "AccountMembership",
                columns: table => new
                {
                    accountMembershipId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    accountId = table.Column<int>(type: "int", nullable: false),
                    membershipPackageId = table.Column<int>(type: "int", nullable: false),
                    startDate = table.Column<DateOnly>(type: "date", nullable: false),
                    endDate = table.Column<DateOnly>(type: "date", nullable: false),
                    isActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__AccountM__1C86D62900EA66B9", x => x.accountMembershipId);
                    table.ForeignKey(
                        name: "FKAccountMem798455",
                        column: x => x.accountId,
                        principalTable: "Account",
                        principalColumn: "accountId");
                    table.ForeignKey(
                        name: "FKAccountMem974204",
                        column: x => x.membershipPackageId,
                        principalTable: "MembershipPackage",
                        principalColumn: "membershipPackageId");
                });

            migrationBuilder.CreateTable(
                name: "Blog",
                columns: table => new
                {
                    blogId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    createdDate = table.Column<DateTime>(type: "datetime", nullable: false),
                    isDeleted = table.Column<bool>(type: "bit", nullable: false),
                    content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    media = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    updatedAt = table.Column<DateTime>(type: "datetime", nullable: true),
                    accountId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Blog__FA0AA72D9C011519", x => x.blogId);
                    table.ForeignKey(
                        name: "FKBlog316425",
                        column: x => x.accountId,
                        principalTable: "Account",
                        principalColumn: "accountId");
                });

            migrationBuilder.CreateTable(
                name: "Conversation",
                columns: table => new
                {
                    conersationId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    account1Id = table.Column<int>(type: "int", nullable: false),
                    account2Id = table.Column<int>(type: "int", nullable: false),
                    createdAt = table.Column<DateTime>(type: "datetime", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Conversa__6952075FAC24F669", x => x.conersationId);
                    table.ForeignKey(
                        name: "FKConversati599262",
                        column: x => x.account2Id,
                        principalTable: "Account",
                        principalColumn: "accountId");
                    table.ForeignKey(
                        name: "FKConversati600223",
                        column: x => x.account1Id,
                        principalTable: "Account",
                        principalColumn: "accountId");
                });

            migrationBuilder.CreateTable(
                name: "Customer",
                columns: table => new
                {
                    customerId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    fullName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    accountId = table.Column<int>(type: "int", nullable: false),
                    gender = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    dateOfBirth = table.Column<DateOnly>(type: "date", nullable: false),
                    address = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    phone = table.Column<string>(type: "varchar(10)", unicode: false, maxLength: 10, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Customer__B611CB7D37AFB881", x => x.customerId);
                    table.ForeignKey(
                        name: "FKCustomer62882",
                        column: x => x.accountId,
                        principalTable: "Account",
                        principalColumn: "accountId");
                });

            migrationBuilder.CreateTable(
                name: "NewsComment",
                columns: table => new
                {
                    newsCommentId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    rating = table.Column<int>(type: "int", nullable: true),
                    createdDate = table.Column<DateTime>(type: "datetime", nullable: false),
                    isDeleted = table.Column<bool>(type: "bit", nullable: false),
                    accountId = table.Column<int>(type: "int", nullable: false),
                    newsId = table.Column<int>(type: "int", nullable: false),
                    updatedAt = table.Column<DateTime>(type: "datetime", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__NewsComm__C49DE04575199369", x => x.newsCommentId);
                    table.ForeignKey(
                        name: "FKNewsCommen23725",
                        column: x => x.accountId,
                        principalTable: "Account",
                        principalColumn: "accountId");
                    table.ForeignKey(
                        name: "FKNewsCommen520782",
                        column: x => x.newsId,
                        principalTable: "News",
                        principalColumn: "newsId");
                });

            migrationBuilder.CreateTable(
                name: "RefreshToken",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    userId = table.Column<int>(type: "int", nullable: false),
                    token = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    expireAt = table.Column<DateTime>(type: "datetime", nullable: false),
                    isRevoked = table.Column<bool>(type: "bit", nullable: false),
                    createdAt = table.Column<DateTime>(type: "datetime", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__RefreshT__3213E83F144396AD", x => x.id);
                    table.ForeignKey(
                        name: "FKRefreshTok914650",
                        column: x => x.userId,
                        principalTable: "Account",
                        principalColumn: "accountId");
                });

            migrationBuilder.CreateTable(
                name: "TourBid",
                columns: table => new
                {
                    tourBid = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    accountId = table.Column<int>(type: "int", nullable: false),
                    createdAt = table.Column<DateTime>(type: "datetime", nullable: false),
                    updatedAt = table.Column<DateTime>(type: "datetime", nullable: true),
                    isDeleted = table.Column<bool>(type: "bit", nullable: false),
                    placeRequested = table.Column<int>(type: "int", nullable: false),
                    status = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    maxPrice = table.Column<float>(type: "real", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__TourBid__6359293A7C00C65F", x => x.tourBid);
                    table.ForeignKey(
                        name: "FKTourBid491964",
                        column: x => x.accountId,
                        principalTable: "Account",
                        principalColumn: "accountId");
                    table.ForeignKey(
                        name: "FKTourBid682696",
                        column: x => x.placeRequested,
                        principalTable: "ActiveArea",
                        principalColumn: "areaId");
                });

            migrationBuilder.CreateTable(
                name: "TourGuide",
                columns: table => new
                {
                    tourGuideId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    fullName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    gender = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    dateOfBirth = table.Column<DateOnly>(type: "date", nullable: false),
                    accountId = table.Column<int>(type: "int", nullable: false),
                    address = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    image = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    phone = table.Column<string>(type: "varchar(10)", unicode: false, maxLength: 10, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__TourGuid__D466D4A2812B0FFF", x => x.tourGuideId);
                    table.ForeignKey(
                        name: "FKTourGuide28174",
                        column: x => x.accountId,
                        principalTable: "Account",
                        principalColumn: "accountId");
                });

            migrationBuilder.CreateTable(
                name: "BlogComment",
                columns: table => new
                {
                    blogCommentId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    accountId = table.Column<int>(type: "int", nullable: false),
                    blogId = table.Column<int>(type: "int", nullable: false),
                    content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    createdAt = table.Column<DateTime>(type: "datetime", nullable: false),
                    isDeleted = table.Column<bool>(type: "bit", nullable: false),
                    updatedAt = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__BlogComm__555BBA7E72120252", x => x.blogCommentId);
                    table.ForeignKey(
                        name: "FKBlogCommen331450",
                        column: x => x.blogId,
                        principalTable: "Blog",
                        principalColumn: "blogId");
                    table.ForeignKey(
                        name: "FKBlogCommen856142",
                        column: x => x.accountId,
                        principalTable: "Account",
                        principalColumn: "accountId");
                });

            migrationBuilder.CreateTable(
                name: "BlogLike",
                columns: table => new
                {
                    blogLikeId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    accountId = table.Column<int>(type: "int", nullable: false),
                    blogId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__BlogLike__E52253F94FC26446", x => x.blogLikeId);
                    table.ForeignKey(
                        name: "FKBlogLike559316",
                        column: x => x.blogId,
                        principalTable: "Blog",
                        principalColumn: "blogId");
                    table.ForeignKey(
                        name: "FKBlogLike84009",
                        column: x => x.accountId,
                        principalTable: "Account",
                        principalColumn: "accountId");
                });

            migrationBuilder.CreateTable(
                name: "Message",
                columns: table => new
                {
                    messageId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    conversationId = table.Column<int>(type: "int", nullable: false),
                    senderId = table.Column<int>(type: "int", nullable: false),
                    messageText = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    messageType = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    sendAt = table.Column<DateTime>(type: "datetime", nullable: false),
                    isRead = table.Column<bool>(type: "bit", nullable: false),
                    isEdited = table.Column<bool>(type: "bit", nullable: false),
                    isDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Message__4808B993E22CC7F8", x => x.messageId);
                    table.ForeignKey(
                        name: "FKMessage122587",
                        column: x => x.senderId,
                        principalTable: "Account",
                        principalColumn: "accountId");
                    table.ForeignKey(
                        name: "FKMessage780995",
                        column: x => x.conversationId,
                        principalTable: "Conversation",
                        principalColumn: "conersationId");
                });

            migrationBuilder.CreateTable(
                name: "NewsReply",
                columns: table => new
                {
                    newsReplyId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    createdDate = table.Column<DateTime>(type: "datetime", nullable: false),
                    isDeleted = table.Column<bool>(type: "bit", nullable: false),
                    replyFor = table.Column<int>(type: "int", nullable: false),
                    accountId = table.Column<int>(type: "int", nullable: false),
                    updatedAt = table.Column<DateTime>(type: "datetime", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__NewsRepl__DB1429933D150C66", x => x.newsReplyId);
                    table.ForeignKey(
                        name: "FKNewsReply112342",
                        column: x => x.accountId,
                        principalTable: "Account",
                        principalColumn: "accountId");
                    table.ForeignKey(
                        name: "FKNewsReply469429",
                        column: x => x.replyFor,
                        principalTable: "NewsComment",
                        principalColumn: "newsCommentId");
                });

            migrationBuilder.CreateTable(
                name: "Bid",
                columns: table => new
                {
                    bidId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    tourBidId = table.Column<int>(type: "int", nullable: false),
                    tourGuideId = table.Column<int>(type: "int", nullable: false),
                    amount = table.Column<float>(type: "real", nullable: false),
                    createdAt = table.Column<DateTime>(type: "datetime", nullable: false),
                    comment = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    status = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Bid__48E98F58BE5BA5ED", x => x.bidId);
                    table.ForeignKey(
                        name: "FKBid623728",
                        column: x => x.tourGuideId,
                        principalTable: "TourGuide",
                        principalColumn: "tourGuideId");
                    table.ForeignKey(
                        name: "FKBid659809",
                        column: x => x.tourBidId,
                        principalTable: "TourBid",
                        principalColumn: "tourBid");
                });

            migrationBuilder.CreateTable(
                name: "Feedback",
                columns: table => new
                {
                    feedbackId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    customerId = table.Column<int>(type: "int", nullable: false),
                    tourGuideId = table.Column<int>(type: "int", nullable: false),
                    createdDate = table.Column<DateTime>(type: "datetime", nullable: false),
                    content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    rating = table.Column<int>(type: "int", nullable: false),
                    isDeleted = table.Column<bool>(type: "bit", nullable: false),
                    updatedAt = table.Column<DateTime>(type: "datetime", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Feedback__2613FD24C69BCF34", x => x.feedbackId);
                    table.ForeignKey(
                        name: "FKFeedback561761",
                        column: x => x.customerId,
                        principalTable: "Customer",
                        principalColumn: "customerId");
                    table.ForeignKey(
                        name: "FKFeedback699513",
                        column: x => x.tourGuideId,
                        principalTable: "TourGuide",
                        principalColumn: "tourGuideId");
                });

            migrationBuilder.CreateTable(
                name: "Invoice",
                columns: table => new
                {
                    invoiceId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    startDate = table.Column<DateTime>(type: "datetime", nullable: false),
                    endDate = table.Column<DateTime>(type: "datetime", nullable: true),
                    tourGuideId = table.Column<int>(type: "int", nullable: false),
                    peopleAmount = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    status = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    price = table.Column<float>(type: "real", nullable: false),
                    note = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    customerId = table.Column<int>(type: "int", nullable: false),
                    areaId = table.Column<int>(type: "int", nullable: false),
                    tourDesc = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    createdDate = table.Column<DateTime>(type: "datetime", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Invoice__1252416C1CC20425", x => x.invoiceId);
                    table.ForeignKey(
                        name: "FKInvoice303466",
                        column: x => x.customerId,
                        principalTable: "Customer",
                        principalColumn: "customerId");
                    table.ForeignKey(
                        name: "FKInvoice441218",
                        column: x => x.tourGuideId,
                        principalTable: "TourGuide",
                        principalColumn: "tourGuideId");
                    table.ForeignKey(
                        name: "FKInvoice643155",
                        column: x => x.areaId,
                        principalTable: "ActiveArea",
                        principalColumn: "areaId");
                });

            migrationBuilder.CreateTable(
                name: "TourGuideDesc",
                columns: table => new
                {
                    tourGuideDescId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    tourGuideId = table.Column<int>(type: "int", nullable: false),
                    yearOfExperience = table.Column<int>(type: "int", nullable: true),
                    description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    areaId = table.Column<int>(type: "int", nullable: false),
                    company = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__TourGuid__5D853B513094440C", x => x.tourGuideDescId);
                    table.ForeignKey(
                        name: "FKTourGuideD540188",
                        column: x => x.areaId,
                        principalTable: "ActiveArea",
                        principalColumn: "areaId");
                    table.ForeignKey(
                        name: "FKTourGuideD742125",
                        column: x => x.tourGuideId,
                        principalTable: "TourGuide",
                        principalColumn: "tourGuideId");
                });

            migrationBuilder.CreateTable(
                name: "TourService",
                columns: table => new
                {
                    serviceId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    serviceName = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    price = table.Column<float>(type: "real", nullable: false),
                    duration = table.Column<TimeOnly>(type: "time", nullable: false),
                    content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    image = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    tourGuideId = table.Column<int>(type: "int", nullable: false),
                    createdDate = table.Column<DateOnly>(type: "date", nullable: false),
                    isDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__TourServ__455070DF9BE25FB6", x => x.serviceId);
                    table.ForeignKey(
                        name: "FKTourServic281225",
                        column: x => x.tourGuideId,
                        principalTable: "TourGuide",
                        principalColumn: "tourGuideId");
                });

            migrationBuilder.CreateTable(
                name: "BlogCommentReply",
                columns: table => new
                {
                    blogCommentReplyId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    accountId = table.Column<int>(type: "int", nullable: false),
                    blogCommentId = table.Column<int>(type: "int", nullable: false),
                    content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    createdAt = table.Column<DateTime>(type: "datetime", nullable: false),
                    isDeleted = table.Column<bool>(type: "bit", nullable: false),
                    updatedAt = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__BlogComm__BE494851D1A07A0E", x => x.blogCommentReplyId);
                    table.ForeignKey(
                        name: "FKBlogCommen494206",
                        column: x => x.blogCommentId,
                        principalTable: "BlogComment",
                        principalColumn: "blogCommentId");
                    table.ForeignKey(
                        name: "FKBlogCommen891262",
                        column: x => x.accountId,
                        principalTable: "Account",
                        principalColumn: "accountId");
                });

            migrationBuilder.CreateTable(
                name: "Payment",
                columns: table => new
                {
                    paymentId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    price = table.Column<float>(type: "real", nullable: false),
                    status = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    completeDate = table.Column<DateTime>(type: "datetime", nullable: false),
                    paymentType = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false, comment: "membership / invoice"),
                    paymentMethod = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false, comment: "momo/ vnpay"),
                    accountId = table.Column<int>(type: "int", nullable: false),
                    membershipPackageId = table.Column<int>(type: "int", nullable: true),
                    invoiceId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Payment__A0D9EFC638C72549", x => x.paymentId);
                    table.ForeignKey(
                        name: "FKPayment16775",
                        column: x => x.membershipPackageId,
                        principalTable: "MembershipPackage",
                        principalColumn: "membershipPackageId");
                    table.ForeignKey(
                        name: "FKPayment215705",
                        column: x => x.accountId,
                        principalTable: "Account",
                        principalColumn: "accountId");
                    table.ForeignKey(
                        name: "FKPayment939394",
                        column: x => x.invoiceId,
                        principalTable: "Invoice",
                        principalColumn: "invoiceId");
                });

            migrationBuilder.CreateTable(
                name: "SystemRevenue",
                columns: table => new
                {
                    systemRevenueId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    paymentId = table.Column<int>(type: "int", nullable: false),
                    value = table.Column<float>(type: "real", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__SystemRe__EED5C17D12AE0E85", x => x.systemRevenueId);
                    table.ForeignKey(
                        name: "FKSystemReve708422",
                        column: x => x.paymentId,
                        principalTable: "Payment",
                        principalColumn: "paymentId");
                });

            migrationBuilder.CreateTable(
                name: "TourGuideRevenue",
                columns: table => new
                {
                    tourGuideRevenue = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    paymentId = table.Column<int>(type: "int", nullable: false),
                    value = table.Column<float>(type: "real", nullable: false),
                    tourGuideId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__TourGuid__049615064CBEB05C", x => x.tourGuideRevenue);
                    table.ForeignKey(
                        name: "FKTourGuideR267432",
                        column: x => x.tourGuideId,
                        principalTable: "TourGuide",
                        principalColumn: "tourGuideId");
                    table.ForeignKey(
                        name: "FKTourGuideR890450",
                        column: x => x.paymentId,
                        principalTable: "Payment",
                        principalColumn: "paymentId");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Account_roleId",
                table: "Account",
                column: "roleId");

            migrationBuilder.CreateIndex(
                name: "UQ__Account__AB6E616407035DCA",
                table: "Account",
                column: "email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AccountMembership_accountId",
                table: "AccountMembership",
                column: "accountId");

            migrationBuilder.CreateIndex(
                name: "IX_AccountMembership_membershipPackageId",
                table: "AccountMembership",
                column: "membershipPackageId");

            migrationBuilder.CreateIndex(
                name: "IX_Bid_tourBidId",
                table: "Bid",
                column: "tourBidId");

            migrationBuilder.CreateIndex(
                name: "IX_Bid_tourGuideId",
                table: "Bid",
                column: "tourGuideId");

            migrationBuilder.CreateIndex(
                name: "IX_Blog_accountId",
                table: "Blog",
                column: "accountId");

            migrationBuilder.CreateIndex(
                name: "IX_BlogComment_accountId",
                table: "BlogComment",
                column: "accountId");

            migrationBuilder.CreateIndex(
                name: "IX_BlogComment_blogId",
                table: "BlogComment",
                column: "blogId");

            migrationBuilder.CreateIndex(
                name: "IX_BlogCommentReply_accountId",
                table: "BlogCommentReply",
                column: "accountId");

            migrationBuilder.CreateIndex(
                name: "IX_BlogCommentReply_blogCommentId",
                table: "BlogCommentReply",
                column: "blogCommentId");

            migrationBuilder.CreateIndex(
                name: "IX_BlogLike_accountId",
                table: "BlogLike",
                column: "accountId");

            migrationBuilder.CreateIndex(
                name: "IX_BlogLike_blogId",
                table: "BlogLike",
                column: "blogId");

            migrationBuilder.CreateIndex(
                name: "IX_Conversation_account1Id",
                table: "Conversation",
                column: "account1Id");

            migrationBuilder.CreateIndex(
                name: "IX_Conversation_account2Id",
                table: "Conversation",
                column: "account2Id");

            migrationBuilder.CreateIndex(
                name: "IX_Customer_accountId",
                table: "Customer",
                column: "accountId");

            migrationBuilder.CreateIndex(
                name: "UQ__Customer__B43B145F0C731CC2",
                table: "Customer",
                column: "phone",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Feedback_customerId",
                table: "Feedback",
                column: "customerId");

            migrationBuilder.CreateIndex(
                name: "IX_Feedback_tourGuideId",
                table: "Feedback",
                column: "tourGuideId");

            migrationBuilder.CreateIndex(
                name: "IX_Invoice_areaId",
                table: "Invoice",
                column: "areaId");

            migrationBuilder.CreateIndex(
                name: "IX_Invoice_customerId",
                table: "Invoice",
                column: "customerId");

            migrationBuilder.CreateIndex(
                name: "IX_Invoice_tourGuideId",
                table: "Invoice",
                column: "tourGuideId");

            migrationBuilder.CreateIndex(
                name: "IX_Message_conversationId",
                table: "Message",
                column: "conversationId");

            migrationBuilder.CreateIndex(
                name: "IX_Message_senderId",
                table: "Message",
                column: "senderId");

            migrationBuilder.CreateIndex(
                name: "IX_NewsCategory_categoryId",
                table: "NewsCategory",
                column: "categoryId");

            migrationBuilder.CreateIndex(
                name: "IX_NewsCategory_newsId",
                table: "NewsCategory",
                column: "newsId");

            migrationBuilder.CreateIndex(
                name: "IX_NewsComment_accountId",
                table: "NewsComment",
                column: "accountId");

            migrationBuilder.CreateIndex(
                name: "IX_NewsComment_newsId",
                table: "NewsComment",
                column: "newsId");

            migrationBuilder.CreateIndex(
                name: "IX_NewsReply_accountId",
                table: "NewsReply",
                column: "accountId");

            migrationBuilder.CreateIndex(
                name: "IX_NewsReply_replyFor",
                table: "NewsReply",
                column: "replyFor");

            migrationBuilder.CreateIndex(
                name: "IX_Payment_accountId",
                table: "Payment",
                column: "accountId");

            migrationBuilder.CreateIndex(
                name: "IX_Payment_invoiceId",
                table: "Payment",
                column: "invoiceId");

            migrationBuilder.CreateIndex(
                name: "IX_Payment_membershipPackageId",
                table: "Payment",
                column: "membershipPackageId");

            migrationBuilder.CreateIndex(
                name: "IX_RefreshToken_userId",
                table: "RefreshToken",
                column: "userId");

            migrationBuilder.CreateIndex(
                name: "IX_SystemRevenue_paymentId",
                table: "SystemRevenue",
                column: "paymentId");

            migrationBuilder.CreateIndex(
                name: "IX_TourBid_accountId",
                table: "TourBid",
                column: "accountId");

            migrationBuilder.CreateIndex(
                name: "IX_TourBid_placeRequested",
                table: "TourBid",
                column: "placeRequested");

            migrationBuilder.CreateIndex(
                name: "IX_TourGuide_accountId",
                table: "TourGuide",
                column: "accountId");

            migrationBuilder.CreateIndex(
                name: "UQ__TourGuid__B43B145FCB2C42A1",
                table: "TourGuide",
                column: "phone",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_TourGuideDesc_areaId",
                table: "TourGuideDesc",
                column: "areaId");

            migrationBuilder.CreateIndex(
                name: "IX_TourGuideDesc_tourGuideId",
                table: "TourGuideDesc",
                column: "tourGuideId");

            migrationBuilder.CreateIndex(
                name: "IX_TourGuideRevenue_paymentId",
                table: "TourGuideRevenue",
                column: "paymentId");

            migrationBuilder.CreateIndex(
                name: "IX_TourGuideRevenue_tourGuideId",
                table: "TourGuideRevenue",
                column: "tourGuideId");

            migrationBuilder.CreateIndex(
                name: "IX_TourService_tourGuideId",
                table: "TourService",
                column: "tourGuideId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AccountMembership");

            migrationBuilder.DropTable(
                name: "Bid");

            migrationBuilder.DropTable(
                name: "BlogCommentReply");

            migrationBuilder.DropTable(
                name: "BlogLike");

            migrationBuilder.DropTable(
                name: "Contact");

            migrationBuilder.DropTable(
                name: "CVApplication");

            migrationBuilder.DropTable(
                name: "Feedback");

            migrationBuilder.DropTable(
                name: "Message");

            migrationBuilder.DropTable(
                name: "NewsCategory");

            migrationBuilder.DropTable(
                name: "NewsReply");

            migrationBuilder.DropTable(
                name: "RefreshToken");

            migrationBuilder.DropTable(
                name: "SystemRevenue");

            migrationBuilder.DropTable(
                name: "TourGuideDesc");

            migrationBuilder.DropTable(
                name: "TourGuideRevenue");

            migrationBuilder.DropTable(
                name: "TourService");

            migrationBuilder.DropTable(
                name: "TourBid");

            migrationBuilder.DropTable(
                name: "BlogComment");

            migrationBuilder.DropTable(
                name: "Conversation");

            migrationBuilder.DropTable(
                name: "Category");

            migrationBuilder.DropTable(
                name: "NewsComment");

            migrationBuilder.DropTable(
                name: "Payment");

            migrationBuilder.DropTable(
                name: "Blog");

            migrationBuilder.DropTable(
                name: "News");

            migrationBuilder.DropTable(
                name: "MembershipPackage");

            migrationBuilder.DropTable(
                name: "Invoice");

            migrationBuilder.DropTable(
                name: "Customer");

            migrationBuilder.DropTable(
                name: "TourGuide");

            migrationBuilder.DropTable(
                name: "ActiveArea");

            migrationBuilder.DropTable(
                name: "Account");

            migrationBuilder.DropTable(
                name: "Role");
        }
    }
}
