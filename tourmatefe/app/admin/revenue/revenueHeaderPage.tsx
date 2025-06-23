import React from "react";
import { Button } from "@/components/ui/button";

export default function RevenueHeader({
  onShowHistory,
  onPaySelected,
  payDisabled,
}: {
  onShowHistory?: () => void;
  onPaySelected?: () => void;
  payDisabled?: boolean;
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold">Tour Guide Revenue Management</h1>
        <div className="text-gray-500">
          Manage payments and track tour guide revenue
        </div>
      </div>
      <div className="flex gap-2 mt-4 md:mt-0">
        <Button variant="outline" onClick={onShowHistory}>
          <span className="mr-2">👁️</span>
          Show Revenue History
        </Button>
        <Button onClick={onPaySelected} disabled={payDisabled}>
          <span className="mr-2">💳</span>
          Pay Selected Revenue
        </Button>
      </div>
    </div>
  );
}
