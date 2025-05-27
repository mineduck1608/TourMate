export type Bid = {
    bidId: number,
    tourBidId: number,
    tourGuideId: number,
    amount: number,
    createdAt: string,
    comment?: string,
    status: string,
}