import { cn } from '@/lib/utils'
import { Bell } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { useToken } from './getToken'
import { MyJwtPayload } from '@/types/JwtPayload'
import { jwtDecode } from 'jwt-decode'
import { getAssociatedId } from '@/app/api/account.api'
import { getTourGuide } from '@/app/api/tour-guide.api'
import { useQuery } from '@tanstack/react-query'
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr'
import { apiHub } from '@/types/constants'


function Notification() {
    const [notificationModal, setNotificationModal] = useState(false)
    const [, setConnection] = useState<HubConnection | null>(null)
    const [, setAreaId] = useState(-1)
    const modalRef = useRef<HTMLDivElement>(null)
    const token = useToken('accessToken')
    const payLoad: MyJwtPayload | undefined = token ? jwtDecode<MyJwtPayload>(token) : undefined
    const accId = Number(payLoad?.AccountId)
    const query = useQuery({
        queryKey: ['id-of', accId],
        queryFn: () => getAssociatedId(accId, 'TourGuide'),
        staleTime: 24 * 3600 * 1000
    })
    const tourGuideId = query.data
    const tourGuideQueryData = useQuery({
        queryFn: () => getTourGuide(tourGuideId ?? -1),
        queryKey: ['tourGuide', tourGuideId],
        staleTime: 24 * 3600 * 1000,
        enabled: !Object.is(tourGuideId, undefined)
    })
    // Close modal when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                setNotificationModal(false)
            }
        }
        if (notificationModal) {
            document.addEventListener("mousedown", handleClickOutside)
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [notificationModal])

    function setupConnection(areaId: number) {
        const newConnection = new HubConnectionBuilder()
            .withUrl(`${apiHub}/notificationHub?areaId=${areaId}`)
            .configureLogging(LogLevel.Information)
            .withAutomaticReconnect()
            .build()

        setConnection(newConnection)

        newConnection
            .start()
            .then(async () => {
                console.log("SignalR connected")
                try {
                    await newConnection.invoke("SubscribeToAreaId", areaId)
                    console.log("subscribed to area", areaId)
                } catch (err) {
                    console.error("Failed to subscribe:", err)
                }
            })
            .catch((e) => console.log("SignalR connection failed: ", e))
        return () => {
            newConnection.off("ReceiveMessage")
            newConnection.stop()
        }
    }

    useEffect(() => {
        if (!tourGuideQueryData || !tourGuideId) return;
        const tourGuideData = tourGuideQueryData.data?.data
        if (!tourGuideData || !tourGuideData.tourGuideDescs) return;
        const area = tourGuideData.tourGuideDescs[0].areaId
        setAreaId(area)
        return setupConnection(area)
    }, [tourGuideQueryData.data?.data])

    return (
        <div ref={modalRef} className='w-full h-full relative'>
            <button className='cursor-pointer' onClick={() => setNotificationModal(!notificationModal)}>
                <Bell className={cn('fill-blue-600 stroke-blue-600 hover:fill-blue-700 hover:stroke-blue-700')} />
            </button>
            {notificationModal && (
                <div
                    className="absolute right-0 top-12 w-96 max-w-[90vw] bg-white rounded-xl shadow-2xl border border-gray-200 z-50 animate-fade-in"
                >
                    <div className="p-4 border-b font-bold text-lg">Thông báo</div>
                    <div className="max-h-80 overflow-y-auto">
                        {/* Example notifications */}
                        <div className="p-4 hover:bg-gray-100 cursor-pointer border-b">
                            <div className="font-medium text-md">Bạn có một tin nhắn mới</div>
                            <div className="text-xs text-gray-500">2 phút trước</div>
                        </div>
                        <div className="p-4 hover:bg-gray-100 cursor-pointer border-b">
                            <div className="font-medium">Tour của bạn đã được xác nhận Tour của bạn đã được xác nhận Tour của bạn đã được xác nhận</div>
                            <div className="text-xs text-gray-500">1 giờ trước</div>
                        </div>
                        <div className="p-4 hover:bg-gray-100 cursor-pointer">
                            <div className="font-medium">Có ưu đãi mới dành cho bạn</div>
                            <div className="text-xs text-gray-500">Hôm nay</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Notification
