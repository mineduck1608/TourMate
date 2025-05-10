"use client"

import axios, { AxiosError } from 'axios'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export const useQueryString = () => {
  const [searchParamsObject, setSearchParamsObject] = useState({})
  const searchParams = useSearchParams()

  useEffect(() => {
    // Chỉ thực thi khi trang được render trên client
    const paramsObject = Object.fromEntries(searchParams.entries())
    setSearchParamsObject(paramsObject)
  }, [searchParams]) // Khi searchParams thay đổi

  return searchParamsObject
}


export function isAxiosError<T>(error: unknown): error is AxiosError<T> {
  return axios.isAxiosError(error)
}
