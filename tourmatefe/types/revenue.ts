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
