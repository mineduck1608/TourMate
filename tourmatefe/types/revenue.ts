export interface RevenueDto {
  revenueId: number;
  tourGuideId: number;
  totalAmount: number;
  actualReceived: number;
  platformCommission: number;
  createdAt: string;
  paymentStatus: boolean;
  tourGuideName: string;
}

export interface RevenueStatsDto {
  totalRevenue: number;
  platformFee: number;
  netRevenue: number;
  totalRecords: number;
  completedPayments: number;
  pendingPayments: number;
  monthlyGrowth: number;
  revenueList: RevenueDto[];
}

export interface MonthlyRevenueDto {
  month: number;
  year: number;
  totalRevenue: number;
  platformFee: number;
  netRevenue: number;
  totalRecords: number;
  completedPayments: number;
  pendingPayments: number;
  growthPercentage: number;
}

export interface RevenueFilterDto {
  tourGuideId: number;
  month: number;
  year: number;
  paymentStatus?: boolean;
  pageNumber: number;
  pageSize: number;
}

export interface RevenueAdmin {
  revenueId: number
  tourGuideId: number
  totalAmount: number
  actualReceived: number
  platformCommission: number
  createdAt: string
  paymentStatus: boolean
  invoiceId?: number
  invoice?: InvoiceAdmin
  tourGuide: TourGuideAdmin
}

export interface InvoiceAdmin {
  invoiceId: number
  tourName: string
  customerName: string
  totalAmount: number
  createdAt: string
}

export interface TourGuideAdmin {
  tourGuideId: number
  name: string
  email: string
  phone: string
  bankAccountNumber: string
  bankName: string
}

export interface ProcessPaymentRequest {
  revenueIds: number[]
  adminId: number
}

export interface PaymentResultAdmin {
  success: boolean
  paymentId: number
  totalAmount: number
  processedCount: number
  message: string
}

export interface PaymentHistoryAdmin {
  id: number
  tourGuideName: string
  totalAmount: number
  paymentDate: string // Changed from Date to string
  paymentMethod: string
  bankName: string
  accountNumber: string
  toursCount: number
}

export interface DashboardStatsAdmin {
  totalUnpaidAmount: number
  totalUnpaidCount: number
  totalPaidThisMonth: number
  totalPaidCountThisMonth: number
  totalTourGuidesWithUnpaidRevenues: number
}

// New DTOs for component props
export interface GroupedRevenue {
  tourGuideId: number
  tourGuide: TourGuideAdmin
  revenues: RevenueAdmin[]
  totalAmount: number
  totalReceived: number
}