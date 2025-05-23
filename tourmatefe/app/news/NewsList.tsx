"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import dayjs from 'dayjs'
import { getNews } from "../api/news.api";
import PaginateList from "./paginate-list";
import { useQueryString } from "../utils/utils";

export default function NewsList() {
  const queryString: { category?: string } = useQueryString();
  const [page, setPage] = useState(1);
  const category = queryString.category ?? ''
  const pageSize = 12
  const { data } = useQuery({
    queryKey: ['news', pageSize, page, category],
    queryFn: () => getNews(page, pageSize, category),
    staleTime: 24 * 3600 * 1000,
  })
  const maxPage = data?.totalPage ?? 0
  useEffect(() => {
    const timer = setInterval(() => {
      if (page < maxPage) {
        setPage(p => p + 1)
      }
    }, 10000); // đổi trang mỗi 10 giây
    return () => clearInterval(timer);
  }, [page, maxPage]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
      className="w-full px-10 py-6 overflow-hidden pb-10"
    >
      <h2 className="text-blue-800 text-3xl inter mb-10 mt-5">Bài viết & Tin tức</h2>

      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          initial={{ opacity: 0, filter: "blur(10px)" }}
          animate={{ opacity: 1, filter: "blur(0)" }}
          exit={{ opacity: 0, filter: "blur(10px)" }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {data?.result.map((item) => (
            <motion.div
              key={item.newsId}
              whileHover={{
                scale: 1.05,
                //boxShadow: "0 16px 40px rgba(0,0,0,0.2)",
              }}
              transition={{ duration: 0.1, ease: "easeInOut" }}
              className="bg-white rounded-xl overflow-hidden shadow-md cursor-pointer transform transition-all"
            >
              <Link href={'/news/' + item.newsId}>
                <img
                  src={item.bannerImg}
                  alt={item.title}
                  className="w-full h-70 object-cover"
                />
                <div className="flex justify-between">
                  <div className="p-6">
                    <p className="text-sm text-gray-500 mb-1">{dayjs(item.createdAt).format('DD/MM/YYYY HH:mm:ss')}</p>
                    <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                    {/* <p className="text-sm text-gray-700">{item.}</p> */}
                  </div>
                  <div className="relative content-center">
                    <p

                      className="text-nowrap text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
                      Xem ngay
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
      <div className="mt-10 place-self-center">
        <PaginateList current={page} maxPage={maxPage}
          onClick={(p) => {
            setPage(p)
          }}
        />
      </div>
    </motion.div>
  );
}
