import { Suspense } from "react";
import MegaMenu from "@/components/mega-menu";
import Footer from "@/components/footer";
import { TourServiceDetail } from "./TourServiceDetail";


export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MegaMenu />
      <TourServiceDetail />
      <Footer />
    </Suspense>   
  );
}
