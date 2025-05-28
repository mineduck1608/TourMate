"use client";

import Banner from "@/components/Banner";
import Footer from "@/components/Footer";
import MegaMenu from "@/components/mega-menu";
import ContactForm from "./contactForm";
import AddressPage from "./address";
import ContactText from "./contactText";

export default function Page() {
  return (
    <main>
      <MegaMenu />
      <Banner
        imageUrl="https://investvietnam.vn/uploads/HOME/Footer/LivingInVietnam/banner.jpg"
        title="Liên hệ" />
      <ContactForm />
      <ContactText />
      <AddressPage />
      <Footer />
    </main>
  );
}
