import { useAuth } from "@/components/authProvider";
import { useToken } from "@/components/getToken";
import { MyJwtPayload } from "@/types/JwtPayload";
import { useQuery } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";
import { ReactNode, useState, useEffect } from "react";
import { getAssociatedId } from "../api/account.api";
import { CustomerSiteContext } from "./context";
import Link from "next/link";
import { getCustomer } from "../api/customer.api";

export function CustomerContent({ children }: { children: ReactNode }) {
  const { role } = useAuth();
  const isLoading = role === null;
  const token = useToken('accessToken')
  const payLoad: MyJwtPayload | undefined = token ? jwtDecode<MyJwtPayload>(token) : undefined
  const accId = Number(payLoad?.AccountId)
  const { data } = useQuery({
    queryKey: ['id-of', accId],
    queryFn: () => getAssociatedId(accId, 'Customer'),
    staleTime: 24 * 3600 * 1000
  })
  const customerQueryData = useQuery({
    queryFn: () => getCustomer(data ?? -1),
    queryKey: ['customer', data],
    staleTime: 24 * 3600 * 1000,
  })
  const customer = customerQueryData.data
  const [, setId] = useState<number | undefined>()
  const [, setAccId] = useState<number | undefined>()
  useEffect(() => {
    if (data) {
      setId(data)
      setAccId(accId)
    }
  }, [data])

  if (isLoading) {
    return (
      null
    );
  }


  if (role !== 'Customer') {
    return <section className="bg-white dark:bg-gray-900 min-h-screen flex items-center justify-center">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center">
          <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 dark:text-primary-500">404</h1>
          <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">Something is missing.</p>
          <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
            Sorry, we can not find that page. You will find lots to explore on the home page.
          </p>
          <Link
            href="/"
            className="inline-flex text-white bg-primary-600 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900 my-4"
          >
            Back to Homepage
          </Link>
        </div>
      </div>
    </section>;
  }


  return <>
    {data && <CustomerSiteContext.Provider value={{ id: data, accId, customer }}>
      {children}
    </CustomerSiteContext.Provider>}
  </>;
}