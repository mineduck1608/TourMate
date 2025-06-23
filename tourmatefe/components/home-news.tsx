"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import dayjs from "dayjs"
import { getNews } from "@/app/api/news.api"
import { Calendar, ArrowRight, Clock } from "lucide-react"
import AOS from "aos"
import "aos/dist/aos.css"

export default function HomeNews() {
  const [page, setPage] = useState(1)
  const pageSize = 3
  const { data } = useQuery({
    queryKey: ["news", pageSize, page],
    queryFn: () => getNews(page, pageSize, "", undefined, true), // exclude content for performance
    staleTime: 24 * 3600 * 1000,
  })
  const maxPage = data?.totalPage ?? 0

  useEffect(() => {
    AOS.init({
      offset: 0,
      delay: 200,
      duration: 1200,
      once: true,
    })
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setPage((p) => (p < maxPage ? p + 1 : 1))
    }, 5000) // đổi trang mỗi 5 giây
    return () => clearInterval(timer)
  }, [page, maxPage])

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

      <div className="mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 inter">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Tin tức</span>{" "}
            & Cẩm nang du lịch
          </h2>
          <p className="text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Cập nhật những thông tin mới nhất về du lịch và những kinh nghiệm hữu ích
          </p>

          {/* Page indicator */}
          {maxPage > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              {[...Array(maxPage)].map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i + 1 === page ? "bg-blue-600 w-8" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* News Grid with Animation */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="mb-12"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial={{ opacity: 0, filter: "blur(10px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(10px)" }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {data?.result.map((item, index) => (
                <motion.div
                  key={item.newsId}
                  className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl overflow-hidden border border-gray-200 hover:border-blue-300 transition-all duration-500 group hover:scale-[1.02] hover:-translate-y-1"
                  data-aos="fade-up"
                  data-aos-delay={300 + index * 100}
                >
                  {/* Image */}
                  <div className="relative overflow-hidden">
                    <img
                      src={item.bannerImg || "/placeholder.svg"}
                      alt={item.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Date badge */}
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2 shadow-lg">
                      <Calendar className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-semibold text-gray-900">
                        {dayjs(item.createdAt).format("DD/MM/YYYY")}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                      <Clock className="h-4 w-4" />
                      <span>{dayjs(item.createdAt).format("HH:mm")}</span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-4 line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight">
                      {item.title}
                    </h3>

                    {/* CTA Button */}
                    <Link
                      href={"/news/" + item.newsId}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl group/btn font-semibold"
                    >
                      Xem ngay
                      <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>

                  {/* Hover effect gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* View All Button */}
        <div className="text-center" data-aos="fade-up" data-aos-delay="600">
          <Link
            href="/news"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 group"
          >
            Xem tất cả tin tức
            <ArrowRight className="h-5 w-5 ml-3 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  )
}
