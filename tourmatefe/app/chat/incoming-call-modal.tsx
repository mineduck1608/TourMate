"use client"

import { Phone, PhoneOff, Video } from "lucide-react"

type Props = {
  type: "voice" | "video"
  callerName: string
  callerAvatar?: string
  onAccept: () => void
  onReject: () => void
}

export default function IncomingCallModal({ type, callerName, callerAvatar, onAccept, onReject }: Props) {
  const defaultAvatar = "https://cdn2.fptshop.com.vn/small/avatar_trang_1_cd729c335b.jpg"

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 flex flex-col items-center max-w-sm w-full mx-4 shadow-2xl">
        {/* Caller Info */}
        <div className="text-center mb-8">
          <img
            src={callerAvatar || defaultAvatar}
            alt={callerName}
            className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-gray-200"
          />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">{callerName}</h2>
          <p className="text-gray-600">{type === "voice" ? "Cuộc gọi thoại đến..." : "Cuộc gọi video đến..."}</p>
        </div>

        {/* Call Type Icon */}
        <div className="mb-8">
          {type === "voice" ? (
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <Phone className="w-8 h-8 text-green-600" />
            </div>
          ) : (
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Video className="w-8 h-8 text-blue-600" />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-6">
          {/* Reject Button */}
          <button
            onClick={onReject}
            className="w-16 h-16 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors shadow-lg"
            title="Từ chối"
          >
            <PhoneOff className="w-8 h-8 text-white" />
          </button>

          {/* Accept Button */}
          <button
            onClick={onAccept}
            className="w-16 h-16 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center transition-colors shadow-lg"
            title="Chấp nhận"
          >
            {type === "voice" ? <Phone className="w-8 h-8 text-white" /> : <Video className="w-8 h-8 text-white" />}
          </button>
        </div>

        {/* Helper Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Nhấn để {type === "voice" ? "nghe máy" : "trả lời video"} hoặc từ chối
          </p>
        </div>
      </div>
    </div>
  )
}
