export type TourBidComment = {
    commentId: number,
    accountId: number,
    tourBidId: number,
    content: string,
    createdAt: string,
    isDeleted: boolean
}

export type TourBidCommentCreateModel = {
    accountId: number,
    tourBidId: number,
    content: string,
}

export type TourBidCommentListResult = {
    commentId: number,
    accountId: number,
    tourBidId: number,
    content: string,
    createdAt: string,
    image: string,
    fullName: string
}