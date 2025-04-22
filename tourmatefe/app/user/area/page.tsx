"use client";

import { useState, useEffect } from "react";

const citiesData = [
  { name: "Hà Nội", region: "North", image: "https://picsum.photos/400/250?random=1" },
  { name: "Hồ Chí Minh", region: "South", image: "https://picsum.photos/400/250?random=2" },
  { name: "Đà Nẵng", region: "Central", image: "https://picsum.photos/400/250?random=3" },
  { name: "Huế", region: "Central", image: "https://picsum.photos/400/250?random=4" },
  { name: "Hải Phòng", region: "North", image: "https://picsum.photos/400/250?random=5" },
  { name: "Nha Trang", region: "South", image: "https://picsum.photos/400/250?random=6" },
  // Có thể thêm nhiều city nữa
];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [regionFilter, setRegionFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const citiesPerPage = 4;

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
      (regionFilter === "all" || city.region.toLowerCase() === regionFilter.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredCities.length / citiesPerPage);
  const startIndex = (currentPage - 1) * citiesPerPage;
  const currentCities = filteredCities.slice(startIndex, startIndex + citiesPerPage);

  const handlePageChange = (direction: number) => {
    setCurrentPage((prevPage) => Math.max(1, Math.min(totalPages, prevPage + direction)));
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage, searchTerm, regionFilter]);

  return (
    <div style={{ display: "flex", padding: "20px", fontFamily: "Arial, sans-serif" }}>
      
      {/* Left Filter Section */}
      <div style={{ width: "25%", padding: "10px", borderRight: "1px solid #ccc" }}>
        <h3>Bộ lọc</h3>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Tìm kiếm thành phố..."
          style={{ width: "100%", padding: "10px", marginBottom: "15px", borderRadius: "8px", border: "1px solid #ddd" }}
        />
        <label>Vùng miền:</label>
        <select
          value={regionFilter}
          onChange={handleRegionChange}
          style={{ width: "100%", padding: "10px", marginTop: "8px", borderRadius: "8px", border: "1px solid #ddd" }}
        >
          <option value="all">Tất cả</option>
          <option value="north">Miền Bắc</option>
          <option value="south">Miền Nam</option>
          <option value="central">Miền Trung</option>
        </select>
      </div>

      {/* Right City Card List Section */}
      <div style={{ width: "75%", padding: "10px" }}>
        <h3>Danh sách thành phố</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "20px" }}>
          {currentCities.map((city, index) => (
            <div key={index} style={{
              border: "1px solid #eee",
              borderRadius: "10px",
              overflow: "hidden",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              transition: "transform 0.2s",
              cursor: "pointer",
            }}>
              <img src={city.image} alt={city.name} style={{ width: "100%", height: "150px", objectFit: "cover" }} />
              <div style={{ padding: "10px" }}>
                <h4 style={{ margin: "10px 0" }}>{city.name}</h4>
                <p style={{ color: "#777", fontSize: "14px" }}>Vùng: {city.region}</p>
                <button style={{
                  marginTop: "10px",
                  width: "100%",
                  backgroundColor: "#000",
                  color: "#fff",
                  padding: "8px",
                  borderRadius: "6px",
                  border: "none",
                  fontWeight: "bold",
                }}>Xem ngay</button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button
            onClick={() => handlePageChange(-1)}
            disabled={currentPage === 1}
            style={{ padding: "10px 20px", margin: "0 5px", borderRadius: "8px", border: "1px solid #ccc", background: "#f9f9f9" }}
          >
            Prev
          </button>
          <span style={{ margin: "0 10px" }}>Trang {currentPage} / {totalPages}</span>
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === totalPages}
            style={{ padding: "10px 20px", margin: "0 5px", borderRadius: "8px", border: "1px solid #ccc", background: "#f9f9f9" }}
          >
            Next
          </button>
        </div>

      </div>
    </div>
  );
}
