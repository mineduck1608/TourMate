"use client"

import type React from "react"

import { useState, useEffect } from "react"
import AOS from "aos"
import "aos/dist/aos.css"
import type { Contact } from "@/types/contact"
import { useMutation } from "@tanstack/react-query"
import { toast } from "react-toastify"
import { addContact } from "../api/contact.api"
import { Mail, Phone, User, MessageSquare, Send, CheckCircle } from "lucide-react"

export default function ContactForm() {
  const [form, setForm] = useState<Contact>({
    contactId: 0,
    fullName: "",
    phone: "",
    email: "",
    title: "",
    content: "",
    createdAt: new Date().toISOString(),
    isProcessed: false,
  })

  // Lưu lỗi cho từng trường
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    AOS.init({
      offset: 0,
      delay: 200,
      duration: 1200,
      once: true,
    })
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Xóa lỗi khi người dùng sửa lại
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }))
  }

  const validate = () => {
    const newErrors: { [key: string]: string } = {}

    // Kiểm tra số điện thoại (Ví dụ: số điện thoại Việt Nam, 10-11 số, bắt đầu 0)
    if (!form.phone) {
      newErrors.phone = "Số điện thoại không được để trống"
    } else {
      const phoneRegex = /^(0\d{9,10})$/
      if (!phoneRegex.test(form.phone)) {
        newErrors.phone = "Số điện thoại không hợp lệ"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const addContactMutation = useMutation({
    mutationFn: addContact,
    onSuccess: () => {
      toast.success("Chúng tôi đã nhận được thông tin của bạn")
      setSubmitted(true)
      setForm({
        contactId: 0,
        fullName: "",
        phone: "",
        email: "",
        title: "",
        content: "",
        createdAt: new Date().toISOString(),
        isProcessed: false,
      })
    },
    onError: (error) => {
      toast.error("Tạo liên hệ thất bại")
      console.error(error)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      addContactMutation.mutate(form)
      console.log(form)
    }
  }

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Liên hệ</span>{" "}
            với chúng tôi
          </h2>
          <p className="text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Hãy để lại thông tin để chúng tôi có thể hỗ trợ bạn tốt nhất
          </p>
        </div>

        {/* Main Content */}
        <div
          className="grid lg:grid-cols-2 gap-12 items-center"
          data-aos="zoom-in-up"
          data-aos-duration="1000"
          data-aos-delay="400"
        >
          {/* Left Side - Image & Info */}
          <div className="relative">
            {/* Main Image */}
            <div className="relative h-[1000px] rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://nld.mediacdn.vn/2019/8/7/giai-i-thac-ban-gioc-nguyen-tan-tuan-tphcm-15652395771991428511775.jpg"
                alt="Contact us"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

              {/* Floating Info Cards */}
              <div className="absolute bottom-8 left-8 right-8 space-y-4">
                <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Thông tin liên hệ</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Phone className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Điện thoại</p>
                        <p className="font-semibold text-gray-900">0977-300-916</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <Mail className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-semibold text-gray-900">tourmate2025@gmail.com</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full opacity-20 blur-xl"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-20 blur-xl"></div>
          </div>

          {/* Right Side - Form */}
          <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-8 lg:p-12">
            {submitted ? (
              <div className="text-center py-12" data-aos="fade-in">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Gửi thành công!</h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Cảm ơn bạn đã gửi thông tin. Chúng tôi sẽ liên hệ lại sớm nhất có thể!
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Gửi tin nhắn khác
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">Gửi tin nhắn</h3>
                  <p className="text-gray-600">Điền thông tin bên dưới để liên hệ với chúng tôi</p>
                </div>

                {/* Full Name */}
                <div className="relative">
                  <label htmlFor="fullName" className="block text-gray-700 font-semibold mb-3">
                    Họ và tên *
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={form.fullName}
                      onChange={handleChange}
                      required
                      placeholder="Nhập họ và tên của bạn"
                      className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="relative">
                  <label htmlFor="phone" className="block text-gray-700 font-semibold mb-3">
                    Số điện thoại *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      id="phone"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="Nhập số điện thoại"
                      className={`w-full pl-12 pr-4 py-4 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 bg-white/50 backdrop-blur-sm ${
                        errors.phone
                          ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                          : "border-gray-200 focus:ring-blue-500 focus:border-transparent"
                      }`}
                    />
                  </div>
                  {errors.phone && <p className="text-red-500 text-sm mt-2 flex items-center gap-1">{errors.phone}</p>}
                </div>

                {/* Email */}
                <div className="relative">
                  <label htmlFor="email" className="block text-gray-700 font-semibold mb-3">
                    Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="Nhập địa chỉ email"
                      className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    />
                  </div>
                </div>

                {/* Title */}
                <div className="relative">
                  <label htmlFor="title" className="block text-gray-700 font-semibold mb-3">
                    Tiêu đề *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                    placeholder="Nhập tiêu đề tin nhắn"
                    className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  />
                </div>

                {/* Content */}
                <div className="relative">
                  <label htmlFor="content" className="block text-gray-700 font-semibold mb-3">
                    Nội dung *
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                    <textarea
                      id="content"
                      name="content"
                      value={form.content}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder="Nhập nội dung tin nhắn của bạn..."
                      className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={addContactMutation.isPending}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
                >
                  {addContactMutation.isPending ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Đang gửi...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                      Gửi tin nhắn
                    </>
                  )}
                </button>

                {/* Additional Info */}
                <div className="text-center pt-4">
                  <p className="text-sm text-gray-500">
                    Bằng cách gửi tin nhắn, bạn đồng ý với{" "}
                    <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                      điều khoản sử dụng
                    </a>{" "}
                    của chúng tôi
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
