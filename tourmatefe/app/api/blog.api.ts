import { Blog } from "@/types/blog";
import http from "../utils/http";

export const getBlogsOfAccount = (id: number | string, pageSize?: number, pageIndex?: number) => http.get<Blog>(`blog/from-account`, {
    params:{
        accountId: id,
        pageSize: pageSize,
        pageIndex: pageIndex
    }
})