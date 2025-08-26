# 🌟 TourMate - Nền Tảng Kết Nối Hướng Dẫn Viên Du Lịch

[![.NET](https://img.shields.io/badge/.NET-8.0-blue.svg)](https://dotnet.microsoft.com/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

TourMate là một nền tảng web hiện đại kết nối du khách với các hướng dẫn viên du lịch địa phương, tạo ra những trải nghiệm du lịch độc đáo và cá nhân hóa.

## 📸 Ảnh Demo

![TourMate Dashboard](public/demo-dashboard.png)
*Dashboard quản trị với thống kê toàn diện*

![Tour Booking](public/demo-booking.png)
*Giao diện đặt tour trực quan và dễ sử dụng*

## 🚀 Tính Năng Chính

### 👥 Dành cho Du Khách
- **Tìm kiếm hướng dẫn viên**: Lọc theo khu vực, đánh giá, kinh nghiệm
- **Đặt tour cá nhân hóa**: Tạo lịch trình theo nhu cầu riêng
- **Thanh toán an toàn**: Tích hợp VNPay và PayOS
- **Chat real-time**: Liên lạc trực tiếp với hướng dẫn viên
- **Đánh giá và nhận xét**: Chia sẻ trải nghiệm sau chuyến đi

### 🎯 Dành cho Hướng Dẫn Viên
- **Quản lý hồ sơ**: Giới thiệu bản thân và kỹ năng
- **Tạo tour**: Thiết kế các gói tour đa dạng
- **Quản lý lịch trình**: Theo dõi các tour đã đặt
- **Nhận thanh toán**: Hệ thống chia sẻ doanh thu minh bạch
- **Gói membership**: Nâng cấp tài khoản để có thêm tính năng

### 🔧 Dành cho Quản Trị Viên
- **Dashboard thống kê**: Báo cáo tài chính và hoạt động
- **Quản lý người dùng**: Phê duyệt hướng dẫn viên mới
- **Quản lý khu vực**: Thiết lập các điểm đến du lịch
- **Báo cáo chi tiết**: Xuất dữ liệu Excel cho phân tích

## 🏗️ Kiến Trúc Hệ Thống

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (Next.js)     │◄──►│   (.NET 8)      │◄──►│   SQL Server    │
│                 │    │                 │    │                 │
│ • React/TypeScript│    │ • Web API       │    │ • Entity Framework│
│ • Tailwind CSS  │    │ • JWT Auth      │    │ • Code First    │
│ • Firebase Auth │    │ • SignalR       │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Frontend (Next.js)
- **Framework**: Next.js 14 với App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn/ui
- **State Management**: TanStack Query (React Query)
- **Authentication**: Firebase Auth + Google OAuth
- **Real-time**: SignalR Client
- **Payment UI**: PayOS Checkout, VNPay

### Backend (.NET 8)
- **Framework**: ASP.NET Core Web API
- **Authentication**: JWT Bearer + Firebase Admin SDK
- **Real-time**: SignalR + Azure SignalR Service
- **Payment**: VNPay SDK, PayOS SDK
- **Email**: SMTP Email Service
- **File Storage**: Firebase Storage
- **Architecture**: Repository Pattern + Service Layer

### Database
- **Database**: SQL Server
- **ORM**: Entity Framework Core (Code First)
- **Migrations**: Automatic database schema management

## 📦 Cấu Trúc Dự Án

```
TourMate/
├── 📁 TourMateBE/                    # Backend .NET
│   ├── 📁 TourMate/                  # Web API Project
│   │   ├── 📁 Controllers/           # API Controllers
│   │   ├── 📁 Mappings/              # AutoMapper Profiles
│   │   ├── 📁 SignalRHub/            # Real-time Hubs
│   │   └── 📄 Program.cs             # Application Entry Point
│   ├── 📁 Repositories/              # Data Access Layer
│   │   ├── 📁 Context/               # Database Context
│   │   ├── 📁 Models/                # Entity Models
│   │   ├── 📁 Migrations/            # EF Migrations
│   │   └── 📁 IRepositories/         # Repository Interfaces
│   ├── 📁 Services/                  # Business Logic Layer
│   │   ├── 📁 Services/              # Service Implementations
│   │   ├── 📁 IServices/             # Service Interfaces
│   │   └── 📁 Utils/                 # Utility Classes
│   └── 📁 RemoveMembership/          # Background Worker
│
├── 📁 tourmatefe/                    # Frontend Next.js
│   ├── 📁 app/                       # App Router Pages
│   │   ├── 📁 admin/                 # Admin Dashboard
│   │   ├── 📁 api/                   # API Client Functions
│   │   ├── 📁 login/                 # Authentication Pages
│   │   ├── 📁 payment/               # Payment Pages
│   │   ├── 📁 tour-guide/            # Tour Guide Features
│   │   └── 📁 tour-service/          # Tour Booking
│   ├── 📁 components/                # Reusable Components
│   │   ├── 📁 ui/                    # Shadcn UI Components
│   │   └── 📄 *.tsx                  # Custom Components
│   ├── 📁 hooks/                     # Custom React Hooks
│   ├── 📁 lib/                       # Utility Libraries
│   ├── 📁 types/                     # TypeScript Type Definitions
│   └── 📄 firebaseConfig.ts          # Firebase Configuration
│
├── 📁 TourMateRemoveMembership/      # Membership Cleanup Service
└── 📄 docker-compose.yml            # Docker Configuration
```

## 🛠️ Cài Đặt và Chạy Dự Án

### Yêu Cầu Hệ Thống
- **Node.js**: v18+ 
- **.NET SDK**: 8.0+
- **SQL Server**: 2019+ hoặc SQL Server Express
- **Git**: Để clone repository

### 1. Clone Repository
```bash
git clone https://github.com/mineduck1608/TourMate.git
cd TourMate
```

### 2. Cài Đặt Backend (.NET)

```bash
cd TourMateBE
```

#### Cấu hình Database
1. Mở `appsettings.json` trong thư mục `TourMate/`
2. Cập nhật connection string:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=TourMateDB;Trusted_Connection=true;TrustServerCertificate=true;"
  }
}
```

#### Chạy Migrations
```bash
dotnet ef database update --project Repositories --startup-project TourMate
```

#### Chạy Backend
```bash
cd TourMate
dotnet run
```
Backend sẽ chạy tại: `https://localhost:5001` hoặc `http://localhost:5000`

### 3. Cài Đặt Frontend (Next.js)

```bash
cd ../tourmatefe
npm install
```

#### Cấu hình Environment Variables
Tạo file `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
# ... các biến môi trường khác
```

#### Chạy Frontend
```bash
npm run dev
```
Frontend sẽ chạy tại: `http://localhost:3000`

### 4. Chạy với Docker (Tùy chọn)

```bash
# Từ thư mục gốc
docker-compose up --build
```

## 🔧 Công Nghệ Sử Dụng

### Frontend Technologies
| Công nghệ | Phiên bản | Mục đích |
|-----------|-----------|----------|
| Next.js | 14.x | React Framework với App Router |
| TypeScript | 5.x | Type Safety |
| Tailwind CSS | 3.x | Styling Framework |
| Shadcn/ui | Latest | Component Library |
| TanStack Query | 5.x | Server State Management |
| Firebase | 10.x | Authentication & Storage |
| SignalR | Latest | Real-time Communication |

### Backend Technologies  
| Công nghệ | Phiên bản | Mục đích |
|-----------|-----------|----------|
| .NET | 8.0 | Backend Framework |
| Entity Framework Core | 8.x | ORM |
| JWT Bearer | Latest | Authentication |
| SignalR | Latest | Real-time Features |
| AutoMapper | Latest | Object Mapping |
| VNPay SDK | Latest | Payment Gateway |
| PayOS SDK | Latest | Payment Gateway |

### Infrastructure
- **Database**: SQL Server with Entity Framework Core
- **Cloud Services**: Azure SignalR Service
- **File Storage**: Firebase Storage
- **Payment**: VNPay, PayOS
- **Email**: SMTP Service
- **Containerization**: Docker & Docker Compose

## 📚 API Documentation

### Authentication Endpoints
```
POST /api/account/login
POST /api/account/google
POST /api/account/register
POST /api/account/request-reset-password
```

### Tour Management
```
GET /api/tour-guide
POST /api/tour-guide
PUT /api/tour-guide/{id}
DELETE /api/tour-guide/{id}
```

### Payment Processing
```
POST /api/payment
GET /api/payment/{id}
GET /api/payment/vnpay-return
```

### Admin Dashboard
```
GET /api/admin-dashboard
GET /api/admin-dashboard/financial
GET /api/admin-dashboard/users
GET /api/admin-dashboard/areas
```

## 🔐 Bảo Mật

- **JWT Authentication**: Tokens với thời gian hết hạn
- **Role-based Authorization**: Customer, TourGuide, Admin
- **Firebase Security**: Google OAuth integration
- **API Rate Limiting**: Chống spam và abuse
- **Input Validation**: Kiểm tra dữ liệu đầu vào
- **HTTPS**: Mã hóa dữ liệu truyền tải

## 🧪 Testing

### Backend Testing
```bash
cd TourMateBE
dotnet test
```

### Frontend Testing
```bash
cd tourmatefe
npm test
```

## 📈 Performance

- **Frontend**: 
  - Next.js App Router cho tối ưu SEO
  - Image optimization tự động
  - Code splitting và lazy loading
  - TanStack Query cho caching

- **Backend**:
  - Entity Framework với query optimization
  - Repository pattern cho separation of concerns
  - SignalR cho real-time performance
  - Background services cho heavy tasks

## 🚀 Deployment

### Frontend (Vercel)
```bash
npm run build
# Deploy to Vercel, Netlify, or other platforms
```

### Backend (Azure/AWS)
```bash
dotnet publish -c Release -o ./publish
# Deploy to Azure App Service, AWS, or Docker containers
```

### Database
- Azure SQL Database
- AWS RDS SQL Server
- On-premise SQL Server

## 🤝 Đóng Góp

1. Fork dự án
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

### Code Style Guidelines
- **Frontend**: ESLint + Prettier configuration
- **Backend**: .NET coding conventions
- **Database**: Consistent naming conventions

## 📄 License

Dự án này được cấp phép theo [MIT License](LICENSE).

## 👥 Team

- **Frontend Developer**: Phát triển giao diện người dùng
- **Backend Developer**: Xây dựng API và business logic  
- **DevOps Engineer**: Triển khai và quản lý infrastructure
- **UI/UX Designer**: Thiết kế trải nghiệm người dùng

## 📞 Liên Hệ

- **Email**: support@tourmate.com
- **Website**: https://tourmate.com
- **GitHub**: https://github.com/mineduck1608/TourMate

## 🔄 Roadmap

### Q1 2025
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Advanced search filters

### Q2 2025  
- [ ] AI-powered tour recommendations
- [ ] Video call integration
- [ ] Loyalty program

### Q3 2025
- [ ] Blockchain payment integration
- [ ] Advanced analytics dashboard
- [ ] Tour guide certification system

---

⭐ **Nếu dự án này hữu ích, hãy cho chúng tôi một star!** ⭐
