"use client";

import Banner from "@/components/Banner";
import { useState, useEffect } from "react";
import "aos/dist/aos.css";
import AOS from "aos";

const citiesData = [
  {
    name: "Hà Nội",
    region: "North",
    image: "https://picsum.photos/400/250?random=1",
  },
  {
    name: "Hồ Chí Minh",
    region: "South",
    image: "https://picsum.photos/400/250?random=2",
  },
  {
    name: "Đà Nẵng",
    region: "Central",
    image: "https://picsum.photos/400/250?random=3",
  },
  {
    name: "Huế",
    region: "Central",
    image: "https://picsum.photos/400/250?random=4",
  },
  {
    name: "Hải Phòng",
    region: "North",
    image: "https://picsum.photos/400/250?random=5",
  },
  {
    name: "Nha Trang",
    region: "South",
    image: "https://picsum.photos/400/250?random=6",
  },
  {
    name: "Cần Thơ",
    region: "South",
    image: "https://picsum.photos/400/250?random=7",
  },
  {
    name: "Đà Lạt",
    region: "South",
    image: "https://picsum.photos/400/250?random=8",
  },
  {
    name: "Quy Nhơn",
    region: "Central",
    image: "https://picsum.photos/400/250?random=9",
  },
  {
    name: "Vinh",
    region: "North",
    image: "https://picsum.photos/400/250?random=10",
  },
  // Có thể thêm nhiều city nữa
];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [regionFilter, setRegionFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const citiesPerPage = 6;

  

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRegionFilter(e.target.value);
    setCurrentPage(1);
  };

  const filteredCities = citiesData.filter((city) => {
    return (
      city.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (regionFilter === "all" ||
        city.region.toLowerCase() === regionFilter.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredCities.length / citiesPerPage);
  const startIndex = (currentPage - 1) * citiesPerPage;
  const currentCities = filteredCities.slice(
    startIndex,
    startIndex + citiesPerPage
  );

  const handlePageChange = (direction: number) => {
    setCurrentPage((prevPage) =>
      Math.max(1, Math.min(totalPages, prevPage + direction))
    );
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage, searchTerm, regionFilter]);

    useEffect(() => {
      AOS.init({
        offset: 0,
        delay: 200,
        duration: 1200,
        once: true,
      });
    }, []);

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
            value={regionFilter}
            onChange={handleRegionChange}
            className="w-full p-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">Tất cả</option>
            <option value="north">Miền Bắc</option>
            <option value="south">Miền Nam</option>
            <option value="central">Miền Trung</option>
          </select>
        </div>

        {/* Danh sách thành phố */}
        <div data-aos="fade-left" className="md:w-2/3 w-full ml-15">
          <h3 className="text-2xl font-semibold mb-4 text-gray-700">
            Danh sách thành phố
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {currentCities.map((city, index) => (
              <div
                key={index}
                className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-2xl transition duration-300 ease-in-out transform"
              >
                <div className="overflow-hidden">
                  <img
                    src={city.image}
                    alt={city.name}
                    className="w-full h-60 object-cover rounded-t-lg transform hover:scale-105 transition duration-300 ease-in-out"
                  />
                </div>
                <div className="p-6">
                  <h4 className="font-semibold text-xl text-gray-800 mb-2">
                    {city.name}
                  </h4>
                  <p className="text-gray-600 text-sm mb-4">
                    Vùng: {city.region}
                  </p>
                  <button className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition duration-300">
                    Xem ngay
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Phân trang */}
          <div className="flex justify-center items-center mt-10 space-x-6">
            <button
              onClick={() => handlePageChange(-1)}
              disabled={currentPage === 1}
              className="px-6 py-3 border rounded-lg bg-gray-300 text-gray-800 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 transition duration-200"
            >
              Trang trước
            </button>
            <span className="text-lg text-gray-700 font-semibold">
              Trang {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === totalPages}
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
