"use client"

import { useContext } from "react"
import TourBidList from "./tour-bid-list"
import SafeImage from "@/components/safe-image"
import BidCreateModal from "./tour-bid-create-modal"
import type { Customer } from "@/types/customer"
import { BidTaskContext, type BidTaskContextProp } from "./tour-bid-task-context"
import DeleteModal from "@/components/delete-modal"
import BidEditModal from "./tour-bid-edit-modal"
import { baseData } from "./tour-bid-task-context"

export default function TourBidPage({ customer, search }: { customer?: Customer; search: string }) {
  const { modalOpen, setModalOpen, setSignal, setTarget, signal } = useContext(BidTaskContext) as BidTaskContextProp

  return (
    <div className="space-y-4">
      {/* Create Post Section */}
      <div className="bg-white rounded-lg shadow-lg p-4 md:p-5">
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
          <div className="flex-shrink-0 self-center sm:self-start">
            <SafeImage
              src={customer?.image}
              className="w-16 h-16 md:w-[100px] md:h-[100px] rounded-full object-cover aspect-square"
              alt={"profile"}
            />
          </div>
          <div className="flex-1 min-w-0">
            <button
              onClick={() => setModalOpen({ ...modalOpen, create: true })}
              className="w-full text-left pl-3 md:pl-4 text-gray-400 border-2 border-gray-200 p-3 md:p-4 h-16 md:h-[75px] rounded-lg bg-white cursor-pointer hover:text-gray-500 hover:border-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <span className="text-sm md:text-base">Đăng bài viết mới...</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tour Bid List */}
      <div className="rounded-lg shadow-lg bg-white">
        <TourBidList search={search} />
      </div>

      {/* Modals */}
      {modalOpen.create && (
        <BidCreateModal
          isOpen={modalOpen.create}
          onClose={() => {
            setTarget({ ...baseData })
            setModalOpen({ ...modalOpen, create: false })
          }}
          onSave={(data) => {
            setTarget(data)
            setSignal({ ...signal, create: true })
          }}
        />
      )}

      <DeleteModal
        isOpen={modalOpen.delete}
        onClose={() => {
          setModalOpen({ ...modalOpen, delete: false })
        }}
        onConfirm={() => {
          setSignal({ ...signal, delete: true })
          setModalOpen({ ...modalOpen, delete: false })
        }}
        message="Xóa cuộc đấu giá này?"
      />

      {modalOpen.edit && (
        <BidEditModal
          isOpen
          onClose={() => {
            setModalOpen({ ...modalOpen, edit: false })
          }}
          onSave={(tourBid) => {
            setTarget(tourBid)
            setModalOpen({ ...modalOpen, edit: false })
            setSignal({ ...signal, edit: true })
          }}
        />
      )}
    </div>
  )
}
