// 'use client'

// import { getTourGuides } from '@/app/api/tour-guide.api';
// import { useQueryString } from '@/app/utils/utils';
// import Banner from '@/components/Banner'
// import { useQuery } from '@tanstack/react-query';
// import dayjs from 'dayjs';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import React, { Suspense, useState } from 'react'
// const LIMIT = 12
// function TourGuideMain() {
//     const queryString: { page?: string } = useQueryString();
//     const router = useRouter();
//     const page = Number(queryString.page) || 1;
//     const [searchTerm, setSearchTerm] = useState("");
//     const { data } = useQuery({
//         queryKey: ["tour-guide", LIMIT, page],
//         queryFn: () => {
//             const controller = new AbortController();
//             setTimeout(() => {
//                 controller.abort();
//             }, 5000);
//             return getTourGuides(
//                 page,
//                 LIMIT,
//                 controller.signal
//             );
//         },
//         retry: 0,
//         refetchOnWindowFocus: false,
//         staleTime: 24 * 3600 * 1000,
//     });

//     const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         setSearchTerm(event.target.value);
//     };

//     const handlePageChange = (a: number) => {
//         router.push(
//             `/services/tour-guide?page=${page + a
//             }`
//         );
//     };

//     return (
//         <div>
//             <div>
//                 <Banner
//                     imageUrl="https://img.freepik.com/premium-photo/vietnam-flag-vintage-wood-wall_118047-4319.jpg?w=1380"
//                     title="TÌM KIẾM HƯỚNG DẪN VIÊN"
//                 />
//             </div>
//             <div className="flex flex-col md:flex-row gap-10 p-15 bg-gray-100">
//                 <div
//                     data-aos="fade-right"
//                     className="md:w-1/4 bg-white shadow-lg rounded-lg p-6 h-full"
//                 >
//                     <h3 className="text-2xl font-semibold mb-4 text-gray-700">Bộ lọc</h3>
//                     <input
//                         type="text"
//                         value={searchTerm}
//                         onChange={handleSearchChange}
//                         placeholder="Tìm kiếm HDV..."
//                         className="w-full mb-4 p-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                     />
                    
//                 </div>

//                 <div data-aos="fade-left" className="md:w-2/3 w-full ml-15">
//                     <h3 className="text-2xl font-semibold mb-4 text-gray-700">
//                         Danh sách hướng dẫn viên
//                     </h3>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
//                         {data?.result?.map((v, index) => (
//                             <Link
//                                 key={index}
//                                 href={`tour-guide/${v.tourGuideId}`}
//                                 passHref
//                             >
//                                 <div className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-2xl transition duration-300 ease-in-out transform cursor-pointer">
//                                     <div className="overflow-hidden">
//                                         <img
//                                             src={v.image || "/fallback.jpg"}
//                                             alt={v.fullName}
//                                             className="w-full h-60 object-cover rounded-t-lg transform hover:scale-105 transition duration-300 ease-in-out"
//                                         />
//                                     </div>
//                                     <div className="p-6">
//                                         <h4 className="font-semibold text-xl text-gray-800 mb-2">
//                                             {v.fullName}
//                                         </h4>
//                                         <p className="text-gray-600 text-sm mb-2">
//                                             {dayjs(v.dateOfBirth).format('DD/MM/YYYY')}
//                                         </p>
//                                         <p className="text-gray-600 text-sm mb-5">
//                                             Khu vực hoạt động: {v.tourGuideDescs[0].area.areaName}
//                                         </p>
//                                         <button className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition duration-300 px-5 py-2.5 me-2 mb-2">
//                                             Xem ngay
//                                         </button>
//                                     </div>
//                                 </div>
//                             </Link>
//                         ))}
//                     </div>

//                     {/* Phân trang */}
//                     <div className="flex justify-center items-center mt-10 space-x-6">
//                         <button
//                             onClick={() => handlePageChange(-1)}
//                             disabled={page === 1}
//                             className="px-6 py-3 border rounded-lg bg-gray-300 text-gray-800 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 transition duration-200"
//                         >
//                             Trang trước
//                         </button>
//                         <span className="text-lg text-gray-700 font-semibold">
//                             Trang {page} / {data?.totalPage}
//                         </span>
//                         <button
//                             onClick={() => handlePageChange(1)}
//                             disabled={
//                                 page === data?.totalPage ||
//                                 data?.totalPage === 0 ||
//                                 data?.totalPage === undefined
//                             }
//                             className="px-6 py-3 border rounded-lg bg-gray-300 text-gray-800 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 transition duration-200"
//                         >
//                             Trang sau
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default function TourGuideDriver() {
//     return (
//         <Suspense fallback={<p>Loading...</p>}>
//             <TourGuideMain />
//         </Suspense>
//     )
// }