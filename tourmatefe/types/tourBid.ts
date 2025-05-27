export interface TourBid {
  tourBidId: number;
  accountId: number;
  createdAt: string; // or Date if you'll use Date objects
  updatedAt?: string; // or Date | null
  isDeleted: boolean;
  placeRequested: number;
  status: string;
  content: string;
  maxPrice?: number;
}