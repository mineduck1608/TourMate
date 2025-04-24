"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PaginateList from "@/app/news/paginate-list";

type NewsItem = {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  date: string;
};

const mockNews: NewsItem[] = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  title: `Tiêu đề tin tức ${i + 1}`,
  description: `Đây là đoạn mô tả ngắn cho tin tức số ${i + 1}.`,
  imageUrl: `https://picsum.photos/seed/news${i + 1}/600/400`,
  date: `2025-04-${(i % 30 + 1).toString().padStart(2, "0")}`,
}));

const PAGE_SIZE = 4;

export default function HomeNews() {
  const [page, setPage] = useState(1);

  const start = (page - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const pageData = mockNews.slice(start, end);
  const hasMore = end < mockNews.length;

  useEffect(() => {
    const timer = setInterval(() => {
      setPage((prev) => (hasMore ? prev + 1 : 1));
    }, 10000); // đổi trang mỗi 10 giây
    return () => clearInterval(timer);
  }, [page]);

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
          {pageData.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 16px 40px rgba(0,0,0,0.2)",
              }}
              transition={{ duration: 0.1, ease: "easeInOut" }}
              className="bg-white rounded-xl overflow-hidden shadow-md cursor-pointer transform transition-all"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-70 object-cover"
              />
              <div className="p-6">
                <p className="text-sm text-gray-500 mb-1">{item.date}</p>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-gray-700">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
      <PaginateList current={page} maxPage={2} />
    </motion.div>
  );
}
