import { Button } from "@/components/ui/button";
import React from "react";
import BidList from "./bid-list";
import Image from "next/image";

export default function Bids() {
  return (
    <div className="">
      <div className="flex h-min">
        <Image
          src={"/Anh1.jpg"}
          className="w-[100px] rounded-full"
          alt={"profile"}
        />
        <div className="ml-4 w-full">
          <input
            className="border-2 p-1 h-[100px] rounded-sm w-full"
            placeholder="Đăng bài viết mới"
          />
        </div>
      </div>
      <div className="w-full flex justify-end">
        <Button
          className="mt-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 md:px-5 md:py-2.5 focus:outline-none cursor-pointer "
          onClick={() => {}}
        >
          Đăng
        </Button>
      </div>
      <BidList />
    </div>
  );
}
