import React, { useState } from "react";
import BidList from "./bid-list";
import SafeImage from "@/components/safe-image";
import BidCreateModal from "./bid-create-modal";

export default function Bids() {
  const [signal, setSignal] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  return (
    <div className="">
      <div className="flex h-min">
        <SafeImage
          src={"/Anh1.jpg"}
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
      <BidList signal={signal} turnOff={() => { setSignal(false) }} />
      <BidCreateModal isOpen={modalOpen} onClose={() => { setModalOpen(false) }} onSave={() => { }} />
    </div>
  );
}
