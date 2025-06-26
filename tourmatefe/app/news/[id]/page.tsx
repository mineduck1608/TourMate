"use client";
import React, { use, useEffect } from "react";
import Header from "@/components/mega-menu";
import Footer from "@/components/Footer";
import Banner from "@/components/Banner";
import RecentNews from "./recent-news";
import NewsCategories from "./categories";
import { useQuery } from "@tanstack/react-query";
import { getOneNews } from "@/app/api/news.api";
import DOMPurify from "dompurify";
import ContactSection from "./contact";

export default function NewsDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const { data } = useQuery({
    queryKey: ["news", id],
    queryFn: () => getOneNews(id),
    staleTime: 24 * 3600 * 1000,
  });

  const news = data?.data;

  // Create a sanitizer function that works in the browser
  const sanitizeContent = (html: string) => {
    // Only sanitize if window is available (client-side)
    if (typeof window !== 'undefined') {
      const clean = DOMPurify.sanitize(html, {
        ADD_TAGS: ["iframe"], // Allow iframes if needed
        ADD_ATTR: ["allow", "allowfullscreen", "frameborder", "scrolling"], // Allow certain attributes
      });

      // Replace image URLs with img tags
      return clean.replace(
        /(https?:\/\/[^\s"<>]+(?:png|jpg|jpeg|gif|bmp|svg))/gi,
        (match) => {
          return `<img src="${match}" alt="Image" style="max-width: 100%; height: auto; object-fit: contain; margin-bottom: 10px;" />`;
        }
      );
    }
    return html; // Fallback for server-side rendering
  };

  useEffect(() => {
    if (news?.content) {
      console.log("🔥 Raw HTML content:", news.content);
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = news.content;
      const aligned = tempDiv.querySelectorAll(".ql-align-center");
      console.log("✅ Số phần tử có class .ql-align-center:", aligned.length);
      aligned.forEach((el, i) => console.log(`Element ${i + 1}:`, el.outerHTML));
    }
  }, [news?.content]);

  return (
    <div className="admin-layout">
      <Header />
      <div className="h-[100%]">
        {news?.bannerImg && news?.title && (
          <Banner imageUrl={news?.bannerImg} title={news?.title} />
        )}
      </div>
      <div className="flex justify-between py-10 px-10">
        <div
          className="w-[65%] p-2 quill-content text-justify"
          dangerouslySetInnerHTML={{
            __html: sanitizeContent(data?.data?.content || ""),
          }}
        />
        {/* Rest of your component remains the same */}
        <div
          className="w-[30%] p-2 *:mb-10 sticky top-30 h-[calc(150vh)] overflow-y-auto overflow-x-hidden"
        >
          <RecentNews currentId={id} />
          <NewsCategories />
          <ContactSection />
        </div>

      </div>

      <Footer />
    </div>
  );
}