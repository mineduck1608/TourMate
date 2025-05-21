"use client";

import Banner from "@/components/Banner";
import Footer from "@/components/Footer";
import MegaMenu from "@/components/MegaMenu";
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
      <hr className="my-6 border-gray-200 sm:mx-auto lg:my-8" />
      <ContactText />
      <AddressPage />
      <Footer />
    </main>
  );
}
