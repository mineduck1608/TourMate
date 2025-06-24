import { Bell } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { getUserRole } from './getToken'


function Notification() {
    const [show, setShow] = useState(false)
    useEffect(() => {
        const storedToken = sessionStorage.getItem("accessToken")
        if (!storedToken) return;
        const userRole = getUserRole(storedToken)
        setShow(userRole === 'TourGuide')
    }, [])

    if (!show) {
        return (
            <div>
            </div>
        )
    }
    return (
        <div>
            <button className='p-2 bg-blue-50 rounded-full hover:bg-blue-100'>
                <Bell />
            </button>
        </div>
    )
}

export default Notification
