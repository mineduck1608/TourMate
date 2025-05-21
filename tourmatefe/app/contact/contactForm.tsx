"use client";

import { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Contact } from "@/types/contact";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { addContact } from "../api/contact.api";

export default function ContactForm() {
  const [form, setForm] = useState<Contact>({
    contactId: 0,
    fullName: "",
    phone: "",
    email: "",
    title: "",
    content: "",
    createdAt: new Date().toISOString(),
    isProcessed: 0,
  });

  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    AOS.init({
      offset: 0,
      delay: 200,
      duration: 1200,
      once: true,
    });
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addContactMutation = useMutation({
    mutationFn: addContact,
    onSuccess: () => {
      toast.success('Chúng tôi đã nhận được thông tin của bạn');
      setSubmitted(true);
      setForm({
        contactId: 0,
        fullName: "",
        phone: "",
        email: "",
        title: "",
        content: "",
        createdAt: new Date().toISOString(),
        isProcessed: 0,
      });
    },
    onError: (error) => {
      toast.error('Tạo liên hệ thất bại');
      console.error(error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addContactMutation.mutate(form); // gọi mutation với data form
  };

  return (
    <div
      className="flex max-w-6xl h-[850px] mx-auto my-20 rounded-lg shadow-lg overflow-hidden border border-gray-300"
      data-aos="zoom-in-up"
      data-aos-duration="1000"
      data-aos-delay="400"
    >
      {/* Bên trái: ảnh full chiều cao và cover hết nửa bên trái */}
      <div className="w-1/2 relative">
        <img
          src="https://nld.mediacdn.vn/2019/8/7/giai-i-thac-ban-gioc-nguyen-tan-tuan-tphcm-15652395771991428511775.jpg"
          alt="Contact us"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* Bên phải: form với background trắng, padding rộng */}
      <div className="w-1/2 bg-white p-12 flex flex-col justify-center">
        <h2 className="text-4xl font-extrabold mb-8 text-gray-800">
          Liên hệ với chúng tôi
        </h2>

        {submitted ? (
          <div className="text-green-600 text-lg font-semibold">
            Cảm ơn bạn đã gửi thông tin. Chúng tôi sẽ liên hệ lại sớm nhất!
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="fullName"
                className="block text-gray-700 font-medium mb-2"
              >
                Họ và tên
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                required
                placeholder="Nhập họ và tên"
                className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-gray-700 font-medium mb-2"
              >
                Số điện thoại
              </label>
              <input
                type="phone"
                id="phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                placeholder="Nhập số điện thoại"
                className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="Nhập email"
                className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="title"
                className="block text-gray-700 font-medium mb-2"
              >
                Tiêu đề
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                placeholder="Nhập tiêu đề"
                className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="content"
                className="block text-gray-700 font-medium mb-2"
              >
                Nội dung
              </label>
              <textarea
                id="content"
                name="content"
                value={form.content}
                onChange={handleChange}
                required
                rows={5}
                placeholder="Nhập nội dung"
                className="w-full border border-gray-300 rounded-md px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-md transition"
            >
              Gửi
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
