import { News } from "@/types/news"
import http from "../utils/http"
import { PagedResult } from "@/types/pagedResult"

export const getNewsList = (pageSize: number, pageIndex: number) => {
    return http.get<PagedResult<News>>(`news?size=${pageSize}&page=${pageIndex}`)
}

export const getNews = (id: string | number) => {
    return http.get<News>(`news/${id}`)
}