export type News = {
    newsId: number;
    title: string;
    createdAt: string; // or string if you prefer to handle it as ISO string
    category: string,
    content: string;
    bannerImg: string;
};