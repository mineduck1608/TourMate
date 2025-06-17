// Types for Admin Dashboard
export interface FinancialStats {
  totalRevenue: number
  tourCommissionRevenue: number
  membershipRevenue: number
  netProfit: number
  profitMargin: number
  revenueGrowth: number
  commissionGrowth: number
  membershipGrowth: number
}

export interface AreaStats {
  areaId: number
  areaName: string
  completedTours: number
  totalRequests: number
  averageRating: number
  totalRevenue: number
  cancelledTours: number
  activeGuides: number
}

export interface UserStats {
  newUsers: number
  newGuides: number
  totalActiveUsers: number
  totalActiveGuides: number
  userGrowthRate: number
  guideGrowthRate: number
}

export interface TourPerformance {
  tourId: number
  tourTitle: string
  areaName: string
  profit: number
  averageBids: number
  averageRating: number
  completedCount: number
}

export interface GuidePerformance {
  guideId: number
  guideName: string
  areaName: string
  averageRating: number
  totalTours: number
  totalRevenue: number
  completionRate: number
}

export interface MembershipStats {
  packageId: number
  packageName: string
  price: number
  duration: string
  totalSales: number
  revenue: number
  growthRate: number
  features: string[]
}

export interface DashboardData {
  financial: FinancialStats
  areas: AreaStats[]
  users: UserStats
  topTours: TourPerformance[]
  topGuides: GuidePerformance[]
  cancelledToursByArea: AreaStats[]
  membershipPackages: MembershipStats[]
}

export interface DashboardFilters {
  dateRange?: {
    from: Date
    to: Date
  }
  selectedArea: string
}
