import React, { useEffect, useState } from "react";
import BidList from "./bid-list";
import SafeImage from "@/components/safe-image";
import BidCreateModal from "./bid-create-modal";
import { TourBid, TourBidListResult } from "@/types/tour-bid";
import { Customer } from "@/types/customer";
import { BidTaskContext } from "./bid-task-context";
import DeleteModal from "@/components/delete-modal";
import BidEditModal from "./bid-edit-modal";
export const baseData: TourBidListResult = {
  tourBidId: 0,
  accountId: 0,
  createdAt: "",
  placeRequested: 0,
  status: "",
  content: "",
  maxPrice: undefined,
  customerName: "",
  placeRequestedName: "",
  likeCount: 0,
  isLiked: false,
  customerImg: ""
}
export default function Bids({ customer, search }: { customer?: Customer, search: string }) {
  const [modalOpen, setModalOpen] = useState({
    changeStatus: false,
    edit: false,
    delete: false,
    create: false
  });
  const [signal, setSignal] = useState({
    edit: false,
    create: false,
    delete: false
  });
  const [target, setTarget] = useState<TourBidListResult | TourBid>({ ...baseData });

  useEffect(() => {
    setTarget({ ...target, accountId: customer?.accountId ?? 0 });
  }, [customer?.accountId]);

  return (
    <BidTaskContext.Provider value={{ signal, setSignal, modalOpen, setModalOpen, setTarget, target }}>
      <div className="z-10 bg-white pt-4 pb-2">
        <div className="flex h-min">
          <SafeImage
            src={customer?.image}
            className="w-[100px] h-[100px] rounded-full"
            alt={"profile"}
          />
          <div className="ml-4 w-full flex items-center">
            <button
              onClick={() => setModalOpen({ ...modalOpen, create: true })}
              className="text-left pl-1 text-gray-400 border-2 p-1 h-[75px] rounded-sm w-full bg-white cursor-pointer hover:text-gray-300"
            >
              Đăng bài viết mới...
            </button>
          </div>
        </div>
      </div>
      <BidList search={search} />

      {modalOpen.create && <BidCreateModal
        isOpen={modalOpen.create}
        onClose={() => {
          setTarget({ ...baseData })
          setModalOpen({ ...modalOpen, create: false })
        }}
        onSave={(data) => {
          setTarget(data)
          setSignal({ ...signal, create: true });
        }}
      />}
      <DeleteModal isOpen={modalOpen.delete}
        onClose={() => {
          setModalOpen({ ...modalOpen, delete: false })
        }}
        onConfirm={() => {
          setSignal({ ...signal, delete: true })
          setModalOpen({ ...modalOpen, delete: false })
        }}
        message="Xóa cuộc đấu giá này?" />
      {modalOpen.edit && <BidEditModal isOpen
        onClose={() => {
          setModalOpen({ ...modalOpen, edit: false })
        }}
        onSave={(tourBid) => {
          setTarget(tourBid)
          setModalOpen({...modalOpen, edit: false})
          setSignal({ ...signal, edit: true })
        }}
      />}
    </BidTaskContext.Provider>
  );
}