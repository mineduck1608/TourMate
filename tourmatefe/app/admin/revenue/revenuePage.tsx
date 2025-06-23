// import React, { useState } from "react";
// import RevenueHeader from "./revenueHeaderPage";
// import { SummaryBoxes } from "./revenueStatBoxes";
// import { RevenueUnpaidBox } from "./revenueUnpaidBox";
// import { FilterBox } from "./revenueFilterBox";
// import { DataTable } from "./data-table";

// export default function RevenuePage() {
//   const [search, setSearch] = useState("");
//   const [status, setStatus] = useState("");

//   // Bạn có thể truyền search/status vào DataTable để filter mockData nếu muốn

//   return (
//     <div>
//       <RevenueHeader
//         onShowHistory={() => alert("Show Revenue History")}
//         onPaySelected={() => alert("Pay Selected Revenue")}
//         payDisabled={true}
//       />
//       <SummaryBoxes />
//       <RevenueUnpaidBox />
//       <FilterBox
//         searchValue={search}
//         onSearchChange={setSearch}
//         statusValue={status}
//         onStatusChange={setStatus}
//         onClear={() => {
//           setSearch("");
//           setStatus("");
//         }}
//       />
//       <DataTable />
//     </div>
//   );
// }
