// import React from "react";

// interface UnpaidGuide {
//   name: string;
//   avatarUrl?: string;
//   unpaidBookings: number;
//   unpaidAmount: number;
// }

// const unpaidGuides: UnpaidGuide[] = [
//   {
//     name: "Sarah Johnson",
//     unpaidBookings: 2,
//     unpaidAmount: 189,
//   },
//   {
//     name: "Emma Rodriguez",
//     unpaidBookings: 2,
//     unpaidAmount: 285,
//   },
//   {
//     name: "Michael Chen",
//     unpaidBookings: 1,
//     unpaidAmount: 52,
//   },
//   {
//     name: "Lisa Thompson",
//     unpaidBookings: 1,
//     unpaidAmount: 91,
//   },
// ];

// export function RevenueUnpaidBox() {
//   return (
//     <div className="bg-white rounded-xl p-6 mt-2 border">
//       <div className="font-semibold text-lg mb-1">
//         Unpaid Revenue Summary by Tour Guide
//       </div>
//       <div className="text-gray-500 mb-5 text-sm">
//         Overview of pending payments for each tour guide
//       </div>
//       <div className="space-y-4">
//         {unpaidGuides.map((guide, idx) => (
//           <div
//             key={guide.name}
//             className="flex items-center justify-between bg-gray-50 rounded-lg px-5 py-4"
//           >
//             <div className="flex items-center gap-4">
//               {/* Avatar placeholder */}
//               <div className="w-11 h-11 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-xl font-bold">
//                 {guide.avatarUrl ? (
//                   <img
//                     src={guide.avatarUrl}
//                     alt={guide.name}
//                     className="w-full h-full rounded-full object-cover"
//                   />
//                 ) : (
//                   <span>✦</span>
//                 )}
//               </div>
//               <div>
//                 <div className="font-semibold text-base">{guide.name}</div>
//                 <div className="text-gray-400 text-sm">
//                   {guide.unpaidBookings} unpaid bookings
//                 </div>
//               </div>
//             </div>
//             <div className="text-right">
//               <div className="text-red-500 font-bold text-lg">
//                 ${guide.unpaidAmount.toFixed(2)}
//               </div>
//               <div className="text-gray-400 text-xs">Total unpaid</div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
