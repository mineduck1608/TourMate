import { Suspense } from "react";
import { TourServiceDetail } from "./TourServiceDetail";
import MegaMenu from "@/components/MegaMenu";
import Footer from "@/components/Footer";


export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MegaMenu />
      <TourServiceDetail />
      <Footer />
    </Suspense>
  );
}
