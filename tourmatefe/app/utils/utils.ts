import axios, { AxiosError } from 'axios'
import { useSearchParams } from 'next/navigation'

export const useQueryString = () => {
  const searchParams = useSearchParams()
  const searchParamsObject = Object.fromEntries(searchParams.entries())
  return searchParamsObject
}


export function isAxiosError<T>(error: unknown): error is AxiosError<T> {
  return axios.isAxiosError(error)
}
