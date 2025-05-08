export type PagedResult<T> = {
    totalResult: number,
    totalPage: number,
    result: T[]
}