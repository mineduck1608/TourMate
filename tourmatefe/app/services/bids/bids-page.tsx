import React, { useEffect, useState } from "react";
import BidList from "./bid-list";
import SafeImage from "@/components/safe-image";
import BidCreateModal from "./bid-create-modal";
import { BidCreateContext } from "./bid-create-context";
import { TourBid } from "@/types/tour-bid";
import { Customer } from "@/types/customer";
export const baseData: TourBid = {
  tourBidId: 0,
  accountId: 0,
  createdAt: "",
  isDeleted: false,
  placeRequested: 0,
  status: "",
  content: "",
  maxPrice: undefined
}
export default function Bids({ customer }: { customer?: Customer }) {
  const [fireUpdate, setFireUpdate] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [formData, setFormData] = useState(baseData)
  useEffect(() => {
    setFormData({ ...formData, accountId: customer?.accountId ?? 0 })
  }, [customer?.accountId])

  return (
    <BidCreateContext.Provider value={{ fireUpdate, setFireUpdate, formData, setFormData }}>
      <div className="flex h-min">
        <SafeImage
          src={customer?.image}
          className="w-[100px] h-[100px] rounded-full"
          alt={"profile"}
        />
        <div className="ml-4 w-full flex items-center">
          <button
            onClick={() => { setModalOpen(true) }}
            className="border-2 p-1 h-[75px] rounded-sm w-full bg-white cursor-pointer hover:text-gray-400"
          >
            Đăng bài viết mới
          </button>
        </div>
      </div>
      <BidList />
      <BidCreateModal isOpen={modalOpen} onClose={() => { setModalOpen(false) }} onSave={() => {
        setFireUpdate(true)
      }} />
    </BidCreateContext.Provider>
  );
}
