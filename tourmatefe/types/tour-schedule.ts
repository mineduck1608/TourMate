export interface TourSchedule {
  invoiceId: number;
  customerName: string;
  customerPhone: string;
  tourGuideName: string;
  tourGuidePhone: string;
  email: string;
  tourName: string;
  tourDesc: string;
  areaName: string;
  startDate: string; // hoặc Date, tùy cách bạn parse ở client
  endDate: string;   // tương tự
  peopleAmount: string;
  price: number;
  paymentMethod: string;
  status: string;
  note: string;
  createdDate: string; // hoặc Date
  tourGuideAccountId: number; // Thêm tourGuideId nếu cần
  customerAccountId: number; // Thêm tourGuideId nếu cần
  tourGuideId: number;
  customerId: number;
}
