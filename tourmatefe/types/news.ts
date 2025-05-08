export type News = {
    newsId: number;
    title: string;
    createdAt: string; // or string if you prefer to handle it as ISO string
    content: string;
    bannerImg: string;
};

export type NewsCategory = {
    newsCategoryId: number;
    categoryId: number;
    newsId: number;
};

export type Category = {
    categoryId: number;
    categoryName: string;
};