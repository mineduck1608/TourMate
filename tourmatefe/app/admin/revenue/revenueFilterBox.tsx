// import React, { useState } from "react";

// interface FilterBoxProps {
//   searchValue: string;
//   onSearchChange: (value: string) => void;
//   statusValue: string;
//   onStatusChange: (value: string) => void;
//   onClear: () => void;
// }

// export function FilterBox({
//   searchValue,
//   onSearchChange,
//   statusValue,
//   onStatusChange,
//   onClear,
// }: FilterBoxProps) {
//   return (
//     <div className="bg-white rounded-xl p-6 mt-6 border mb-6">
//       <div className="font-semibold text-lg mb-4">Filters</div>
//       <div className="flex flex-col md:flex-row gap-3 items-center">
//         <div className="flex-1 w-full">
//           <div className="relative">
//             <span className="absolute left-3 top-2.5 text-gray-400">
//               <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
//                 <circle
//                   cx="11"
//                   cy="11"
//                   r="7"
//                   stroke="#9CA3AF"
//                   strokeWidth="2"
//                 />
//                 <path
//                   stroke="#9CA3AF"
//                   strokeWidth="2"
//                   strokeLinecap="round"
//                   d="M20 20l-3-3"
//                 />
//               </svg>
//             </span>
//             <input
//               type="text"
//               className="pl-10 pr-3 py-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-100"
//               placeholder="Search tour guide name..."
//               value={searchValue}
//               onChange={(e) => onSearchChange(e.target.value)}
//             />
//           </div>
//         </div>
//         <select
//           className="border rounded px-3 py-2 min-w-[140px] focus:outline-none"
//           value={statusValue}
//           onChange={(e) => onStatusChange(e.target.value)}
//         >
//           <option value="">All Status</option>
//           <option value="Paid">Paid</option>
//           <option value="Unpaid">Unpaid</option>
//         </select>
//         <button
//           className="border rounded px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-1"
//           onClick={onClear}
//         >
//           <span className="text-lg">×</span> Clear Filters
//         </button>
//       </div>
//     </div>
//   );
// }
