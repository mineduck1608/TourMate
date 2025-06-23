// import React from "react";

// interface SummaryBoxProps {
//   title: string;
//   value: string | number;
//   subtitle: string;
//   color: "red" | "orange" | "blue" | "green";
//   icon?: React.ReactNode;
//   rightIcon?: React.ReactNode;
// }

// const colorMap = {
//   red: "text-red-500",
//   orange: "text-orange-500",
//   blue: "text-blue-500",
//   green: "text-green-500",
// };

// const borderMap = {
//   red: "border-red-100",
//   orange: "border-orange-100",
//   blue: "border-blue-100",
//   green: "border-green-100",
// };

// export function SummaryBoxes() {
//   // Fake data
//   const boxes: SummaryBoxProps[] = [
//     {
//       title: "Total Unpaid Revenue",
//       value: "$617.00",
//       subtitle: "Pending payments",
//       color: "red",
//       rightIcon: <span className="text-red-400 text-lg">$</span>,
//     },
//     {
//       title: "Total Unpaid Guides",
//       value: 4,
//       subtitle: "Guides awaiting payment",
//       color: "orange",
//       rightIcon: (
//         <span
//           className="text-orange-400 text-lg"
//           style={{ transform: "rotate(-90deg)", display: "inline-block" }}
//         >
//           ⇨
//         </span>
//       ),
//     },
//     {
//       title: "Selected Revenue",
//       value: "$0.00",
//       subtitle: "0 items selected",
//       color: "blue",
//       rightIcon: <span className="text-blue-400 text-lg">📈</span>,
//     },
//     {
//       title: "Bookings This Month",
//       value: 0,
//       subtitle: "Current month bookings",
//       color: "green",
//       rightIcon: <span className="text-green-400 text-lg">📅</span>,
//     },
//   ];

//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
//       {boxes.map((box, idx) => (
//         <div
//           key={idx}
//           className={`bg-white border ${
//             borderMap[box.color]
//           } rounded-xl px-6 py-5 flex flex-col justify-between shadow-sm`}
//         >
//           <div className="flex items-center justify-between">
//             <div className="font-medium text-gray-700">{box.title}</div>
//             {box.rightIcon}
//           </div>
//           <div className={`mt-2 text-2xl font-bold ${colorMap[box.color]}`}>
//             {box.value}
//           </div>
//           <div className="text-sm text-gray-400 mt-1">{box.subtitle}</div>
//         </div>
//       ))}
//     </div>
//   );
// }
