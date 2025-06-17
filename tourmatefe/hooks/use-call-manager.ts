// hooks/useCallManager.ts
"use client"

import { useState, useEffect } from "react"
import type { HubConnection } from "@microsoft/signalr"

export type CallState = {
  type: "voice" | "video" | null
  status: "idle" | "calling" | "incoming" | "connected"
  fromAccountId?: number
  toAccountId?: number
  conversationId?: number
  callId?: string
  isCaller?: boolean
  callerName?: string
  callerAvatar?: string
}

export default function useCallManager(connection: HubConnection | null, currentAccountId: number | null) {
  const [callState, setCallState] = useState<CallState>({ type: null, status: "idle" })

  useEffect(() => {
    if (!connection || !currentAccountId) return

    const handleIncomingCall = (
      type: "voice" | "video",
      fromAccountId: number,
      toAccountId: number,
      conversationId: number,
      callId: string,
      callerName: string,
      callerAvatar?: string
    ) => {
      if (toAccountId !== currentAccountId) return

      setCallState({
        type,
        status: "incoming",
        fromAccountId,
        toAccountId,
        conversationId,
        callId,
        isCaller: false,
        callerName,
        callerAvatar
      })
    }

    connection.on("IncomingCall", handleIncomingCall)

    return () => {
      connection.off("IncomingCall", handleIncomingCall)
    }
  }, [connection, currentAccountId])

  return { callState, setCallState }
}
