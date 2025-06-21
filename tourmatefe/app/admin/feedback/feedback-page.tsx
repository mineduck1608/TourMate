"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import FeedbackHeader from "./feedback-header"
import FeedbackOverview from "./feedback-overview"
import TourFeedbackList from "./tour-feedback-list"
import PlatformFeedbackList from "./platform-feedback-list"
import FeedbackAnalytics from "./feedback-analytics"

export default function FeedbackPage() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen bg-gray-50">
      <FeedbackHeader />

      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Tổng quan</TabsTrigger>
            <TabsTrigger value="tour-feedback">Đánh giá Tour</TabsTrigger>
            <TabsTrigger value="platform-feedback">Đánh giá Hệ thống</TabsTrigger>
            <TabsTrigger value="analytics">Phân tích</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <FeedbackOverview />
          </TabsContent>

          <TabsContent value="tour-feedback">
            <TourFeedbackList />
          </TabsContent>

          <TabsContent value="platform-feedback">
            <PlatformFeedbackList />
          </TabsContent>

          <TabsContent value="analytics">
            <FeedbackAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
