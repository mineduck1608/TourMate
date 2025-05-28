export type ActiveArea = {
    areaId: number;
    areaName: string;
    areaTitle: string;
    areaSubtitle: string;
    areaContent: string;
    bannerImg: string;
    areaType: string;
    createdAt: string;
};

export type SimplifiedActiveArea = {
    areaId: number,
    areaName: string
}

export type MostPopularArea = SimplifiedActiveArea & {
    tourBidCount: number
}