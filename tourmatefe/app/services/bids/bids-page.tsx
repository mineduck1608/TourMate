import React, { useEffect, useState } from "react";
import BidList from "./bid-list";
import SafeImage from "@/components/safe-image";
import BidCreateModal from "./bid-create-modal";
import { TourBid } from "@/types/tour-bid";
import { Customer } from "@/types/customer";
import { BidTaskContext } from "./bid-task-context";
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
  const [modalOpen, setModalOpen] = useState({
    changeStatus: false,
    edit: false,
    delete: false,
    create: false
  })
  const [signal, setSignal] = useState({
    edit: false,
    create: false
  })
  const [target, setTarget] = useState(baseData)
  useEffect(() => {
    setTarget({ ...target, accountId: customer?.accountId ?? 0 })
  }, [customer?.accountId])

  return (
    <BidTaskContext.Provider value={{ signal, setSignal, modalOpen, setModalOpen, setTarget, target }}>
      <div className="flex h-min">
        <SafeImage
          src={customer?.image}
          className="w-[100px] h-[100px] rounded-full"
          alt={"profile"}
        />
        <div className="ml-4 w-full flex items-center">
          <button
            onClick={() => {
              setModalOpen({ ...modalOpen, create: true })
            }}
            className="border-2 p-1 h-[75px] rounded-sm w-full bg-white cursor-pointer hover:text-gray-400"
          >
            Đăng bài viết mới
          </button>
        </div>
      </div>
      <BidList />
      <BidCreateModal isOpen={modalOpen.create} onClose={() => { setModalOpen({ ...modalOpen, create: false }) }} onSave={() => {
        setSignal({ ...signal, create: true })
      }} />
    </BidTaskContext.Provider>
  );
}
