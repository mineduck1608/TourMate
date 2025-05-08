"use client";

import Banner from "@/components/Banner";
import { Suspense, useEffect, useState } from "react";
import "aos/dist/aos.css";
import AOS from "aos";
import { useQueryString } from "@/app/utils/utils";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getFilteredActiveAreas } from "@/app/api/active-area.api";

const LIMIT = 8;

function ActiveAreaList() {
  const queryString: { page?: string } = useQueryString();
  const page = Number(queryString.page) || 1;
  const router = useRouter();

  // Tạo state để lưu giá trị tìm kiếm và vùng miền
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleRegionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedRegion(event.target.value);
  };

  const handlePageChange = (a: number) => {
    router.push(`/services/active-area?page=${page + a}&search=${searchTerm}&region=${selectedRegion}`);
  };

  const { data } = useQuery({
    queryKey: ["active-area", page, searchTerm, selectedRegion],
    queryFn: () => {
      const controller = new AbortController();
      setTimeout(() => {
        controller.abort();
      }, 5000);
      return getFilteredActiveAreas(page, LIMIT, searchTerm, selectedRegion, controller.signal);
    },
    retry: 0,
    refetchOnWindowFocus: false,
    staleTime: 24 * 3600 * 1000
  });

  useEffect(() => {
    AOS.init({
      offset: 0,
      delay: 200,
      duration: 1200,
      once: true,
    });
  }, []);

  // Lắng nghe sự thay đổi của các tham số và cập nhật URL
  useEffect(() => {
    // Sử dụng replace thay vì push để tránh cuộn trang lên đầu
    router.replace(`/services/active-area?page=${page}&search=${searchTerm}&region=${selectedRegion}`);
  }, [page, searchTerm, selectedRegion, router]);

  return (
    <div>
      <div>
        <Banner
          imageUrl="https://img.freepik.com/premium-photo/vietnam-flag-vintage-wood-wall_118047-4319.jpg?w=1380"
          title="Khám Phá Các Địa Điểm Du Lịch Tại Việt Nam"
        />
      </div>
      <div className="flex flex-col md:flex-row gap-10 p-15 bg-gray-100">
        {/* Bộ lọc bên trái */}
        <div data-aos="fade-right" className="md:w-1/4 bg-white shadow-lg rounded-lg p-6 h-full">
          <h3 className="text-2xl font-semibold mb-4 text-gray-700">Bộ lọc</h3>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Tìm kiếm thành phố..."
            className="w-full mb-4 p-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <label className="block mb-2 font-medium text-gray-600">
            Vùng miền:
          </label>
          <select
            value={selectedRegion}
            onChange={handleRegionChange}
            className="w-full p-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Tất cả</option>
            <option value="Miền Bắc">Miền Bắc</option>
            <option value="Miền Nam">Miền Nam</option>
            <option value="Miền Trung">Miền Trung</option>
            <option value="Miền Tây">Miền Tây</option>
          </select>
        </div>

        {/* Danh sách thành phố */}
        <div data-aos="fade-left" className="md:w-2/3 w-full ml-15">
          <h3 className="text-2xl font-semibold mb-4 text-gray-700">
            Danh sách thành phố
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {data?.result?.map((area, index) => (
              <div
                key={index}
                className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-2xl transition duration-300 ease-in-out transform"
              >
                <div className="overflow-hidden">
                  <img
                    src={area.bannerImg || "/fallback.jpg"}
                    alt={area.areaName}
                    className="w-full h-60 object-cover rounded-t-lg transform hover:scale-105 transition duration-300 ease-in-out"
                  />
                </div>
                <div className="p-6">
                  <h4 className="font-semibold text-xl text-gray-800 mb-2">
                    {area.areaName}
                  </h4>
                  <p className="text-gray-600 text-sm mb-4">Khu vực: {area.areaType}</p>
                  <Link href={`active-area/${area.areaId}`} className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition duration-300 px-5 py-2.5 me-2 mb-2">
                    Xem ngay
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Phân trang */}
          <div className="flex justify-center items-center mt-10 space-x-6">
            <button
              onClick={() => handlePageChange(-1)}
              disabled={page === 1}
              className="px-6 py-3 border rounded-lg bg-gray-300 text-gray-800 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 transition duration-200"
            >
              Trang trước
            </button>
            <span className="text-lg text-gray-700 font-semibold">
              Trang {page} / {data?.totalPage}
            </span>
            <button
              onClick={() => handlePageChange(1)}
              disabled={page === data?.totalPage || data?.totalPage === 0}
              className="px-6 py-3 border rounded-lg bg-gray-300 text-gray-800 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 transition duration-200"
            >
              Trang sau
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ActiveAreaDriver() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ActiveAreaList />
    </Suspense>
  );
}
