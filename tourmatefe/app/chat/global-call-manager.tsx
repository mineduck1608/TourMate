"use client"

import { useEffect, useState, forwardRef, useImperativeHandle } from "react"
import type { HubConnection } from "@microsoft/signalr"
import IncomingCallModal from "./incoming-call-modal"
import CallModal from "./call-modal"
import type { ConversationResponse } from "@/types/conversation"
import ModalPortal from "./modal-controller"

type CallState = {
  type: "voice" | "video" | null
  status: "calling" | "connected" | "incoming" | null
  fromAccountId?: number
  toAccountId?: number
  conversationId?: number
  callId?: string
  isCaller?: boolean
  callerName?: string
  callerAvatar?: string
}

type CallInfo = {
  callId: string,
  fromAccountId: number,
  toAccountId: number,
  callType: "voice" | "video" | null
  conversationId: number,
  createdAt: string
}
type Props = {
  connection: HubConnection | null
  currentAccountId: number
  conversations: ConversationResponse[]
}

export type GlobalCallManagerRef = {
  initiateCall: (type: "voice" | "video", conversationId: number, toAccountId: number) => Promise<void>
}

const GlobalCallManager = forwardRef<GlobalCallManagerRef | null, Props>(
  ({ connection, currentAccountId, conversations }, ref) => {
    const [callState, setCallState] = useState<CallState>({ type: null, status: null })

    // Expose initiateCall method to parent components
    useImperativeHandle(ref, () => ({
      initiateCall: async (type: "voice" | "video", conversationId: number, toAccountId: number) => {
        if (!connection) {
          console.error("❌ No SignalR connection available")
          return
        }

        if (connection.state !== "Connected") {
          console.error("❌ SignalR connection not ready, state:", connection.state)
          return
        }

        // ⚠️ IMPORTANT: Check if trying to call yourself
        if (currentAccountId === toAccountId) {
          console.error("❌ Cannot call yourself! currentAccountId:", currentAccountId, "toAccountId:", toAccountId)
          alert("Không thể gọi cho chính mình!")
          return
        }

        const callId = `call_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

        console.log("🚀 ===== INITIATING CALL =====")
        console.log("📞 Call Type:", type)
        console.log("💬 Conversation ID:", conversationId)
        console.log("👤 From (Me):", currentAccountId)
        console.log("🎯 To (Target):", toAccountId)
        console.log("🆔 Call ID:", callId)
        console.log("🔗 Connection State:", connection.state)
        console.log("================================")

        try {
          // Make sure we're in the conversation group first
          await connection.invoke("JoinConversation", conversationId)
          console.log("✅ Joined conversation group:", conversationId)

          await connection.invoke("InitiateCall", {
            callId,
            fromAccountId: currentAccountId,
            toAccountId,
            callType: type,
            conversationId,
          })

          console.log("✅ InitiateCall sent successfully")

          setCallState({
            type,
            status: "calling",
            callId,
            isCaller: true,
            conversationId,
            toAccountId,
          })
        } catch (error) {
          console.error("❌ Failed to initiate call:", error)
        }
      },
    }))

    useEffect(() => {
      if (!connection) {
        console.log("⏳ No SignalR connection yet")
        return
      }

      console.log("🔗 ===== SETTING UP CALL HANDLERS =====")
      console.log("📊 Connection state:", connection.state)
      console.log("👤 Current account ID:", currentAccountId)
      console.log("💬 Available conversations:", conversations.length)
      console.log("=====================================")

      // ✅ MATCH EXACT SERVER EVENT NAMES (all lowercase)
      const handleReceiveCallOffer = (data: CallInfo) => {
        console.log("🌍 📞 ===== RECEIVED CALL OFFER =====")
        console.log("📞 Raw data:", JSON.stringify(data, null, 2))
        console.log("🔍 Current account ID:", currentAccountId, typeof currentAccountId)
        console.log("🔍 Target account ID:", data.toAccountId, typeof data.toAccountId)
        console.log("🔍 From account ID:", data.fromAccountId, typeof data.fromAccountId)
        console.log("🔍 Conversation ID:", data.conversationId)
        console.log("🔍 Call Type:", data.callType)
        console.log("🔍 Call ID:", data.callId)

        // ⚠️ STRICT COMPARISON WITH TYPE CONVERSION
        const isForMe = Number(data.toAccountId) === Number(currentAccountId)
        console.log("🔍 Is for me?", isForMe)
        console.log("🔍 Comparison:", `${data.toAccountId} === ${currentAccountId}`)

        if (isForMe) {
          console.log("✅ Call offer is for me! Processing...")

          const conversation = conversations.find(
            (conv) =>
              conv.conversation.conversationId === data.conversationId ||
              conv.conversation.account1Id === data.fromAccountId ||
              conv.conversation.account2Id === data.fromAccountId,
          )

          console.log("🔍 Found conversation:", conversation)

          const newCallState = {
            type: data.callType,
            status: "incoming" as const,
            fromAccountId: data.fromAccountId,
            toAccountId: data.toAccountId,
            conversationId: data.conversationId,
            callId: data.callId,
            isCaller: false,
            callerName: conversation?.accountName2 || "Người dùng",
            callerAvatar: conversation?.account2Img,
          }

          console.log("🔄 Setting new call state:", newCallState)
          setCallState(newCallState)
        } else {
          console.log("❌ Call offer is NOT for me, ignoring")
          console.log("❌ Expected:", currentAccountId, "Got:", data.toAccountId)
        }
        console.log("🌍 📞 ===== END CALL OFFER PROCESSING =====")
      }

      const handleCallAccepted = (data: { callId: string; acceptedBy: number }) => {
        console.log("🌍 ✅ CALL ACCEPTED:", data)
        setCallState((prev) => {
          console.log("🔍 Previous call state:", prev)
          if (prev.callId === data.callId || prev.status === "calling" || prev.status === "incoming") {
            console.log("✅ Updating call state to connected")
            return { ...prev, status: "connected" }
          }
          console.log("❌ Call ID doesn't match or wrong status")
          return prev
        })
      }

      const handleCallRejected = (data: { callId: string; rejectedBy: number }) => {
        console.log("🌍 ❌ CALL REJECTED:", data)
        setCallState((prev) => {
          if (prev.callId === data.callId || prev.status === "calling" || prev.status === "incoming") {
            console.log("✅ Clearing call state due to rejection")
            return { type: null, status: null }
          }
          return prev
        })
      }

      const handleCallEnded = (data: { callId: string; endedBy: number }) => {
        console.log("🌍 🔚 CALL ENDED:", data)
        setCallState((prev) => {
          if (prev.callId === data.callId || prev.status !== null) {
            console.log("✅ Clearing call state due to call end")
            return { type: null, status: null }
          }
          return prev
        })
      }

      // ✅ REGISTER WITH EXACT SERVER EVENT NAMES (all lowercase)
      console.log("📡 Registering call management handlers with lowercase names...")
      connection.on("ReceiveCallOffer", handleReceiveCallOffer)
      connection.on("CallAccepted", handleCallAccepted)
      connection.on("CallRejected", handleCallRejected)
      connection.on("CallEnded", handleCallEnded)

      console.log("✅ All call management handlers registered")

      const tryJoinConversations = async () => {
    if (connection.state === "Connected") {
      console.log("✅ Connection ready. Joining all conversations...")
      for (const conv of conversations) {
        try {
          await connection.invoke("JoinConversation", conv.conversation.conversationId)
          console.log(`✅ Joined conversation group: ${conv.conversation.conversationId}`)
        } catch (err) {
          console.error(`❌ Failed to join conversation ${conv.conversation.conversationId}:`, err)
        }
      }
    } else {
      console.log("⏳ Waiting for SignalR connection to be ready...")
      setTimeout(tryJoinConversations, 500)
    }
  }

  tryJoinConversations()
  
      return () => {
        console.log("🧹 Cleaning up call management handlers")
        connection.off("ReceiveCallOffer", handleReceiveCallOffer)
        connection.off("CallAccepted", handleCallAccepted)
        connection.off("CallRejected", handleCallRejected)
        connection.off("CallEnded", handleCallEnded)
      }
    }, [connection, currentAccountId, conversations])

    // Log call state changes
    useEffect(() => {
      console.log("🔄 Call state changed:", callState)
    }, [callState])

    const acceptCall = async () => {
      if (!connection || !callState.callId) {
        console.error("❌ Cannot accept call: no connection or callId")
        return
      }

      console.log("✅ Accepting call:", callState.callId)

      try {
        await connection.invoke("AcceptCall", {
          CallId: callState.callId,
          AcceptedBy: currentAccountId,
          RejectedBy: 0,
          EndedBy: 0,
        })

        console.log("✅ AcceptCall sent successfully")
        setCallState((prev) => ({ ...prev, status: "connected" }))
      } catch (error) {
        console.error("❌ Failed to accept call:", error)
      }
    }

    const rejectCall = async () => {
      if (!connection || !callState.callId) {
        console.error("❌ Cannot reject call: no connection or callId")
        return
      }

      console.log("❌ Rejecting call:", callState.callId)

      try {
        await connection.invoke("RejectCall", {
          CallId: callState.callId,
          AcceptedBy: 0,
          RejectedBy: currentAccountId,
          EndedBy: 0,
        })

        console.log("✅ RejectCall sent successfully")
        setCallState({ type: null, status: null })
      } catch (error) {
        console.error("❌ Failed to reject call:", error)
      }
    }

    const endCall = async () => {
      if (!connection || !callState.callId) {
        console.error("❌ Cannot end call: no connection or callId")
        return
      }

      console.log("🔚 Ending call:", callState.callId)

      try {
        await connection.invoke("EndCall", {
          CallId: callState.callId,
          AcceptedBy: 0,
          RejectedBy: 0,
          EndedBy: currentAccountId,
        })

        console.log("✅ EndCall sent successfully")
        setCallState({ type: null, status: null })
      } catch (error) {
        console.error("❌ Failed to end call:", error)
      }
    }

    return (
      <>
        {/* Incoming Call Modal */}
        {callState.status === "incoming" && callState.type && (
          <ModalPortal>
            <IncomingCallModal
              type={callState.type}
              callerName={callState.callerName || "Người dùng"}
              callerAvatar={callState.callerAvatar}
              onAccept={acceptCall}
              onReject={rejectCall}
            />
          </ModalPortal>
        )}

        {/* Active Call Modal */}
        {(callState.status === "calling" || callState.status === "connected") &&
          callState.type &&
          callState.conversationId &&
          (callState.toAccountId || callState.fromAccountId) && (
            <>
              {console.log("📞 Rendering call modal")}
              <CallModal
                type={callState.type}
                conversationId={callState.conversationId}
                onClose={endCall}
                peerId={callState.isCaller ? callState.toAccountId! : callState.fromAccountId!}
                currentAccountId={currentAccountId}
                connection={connection ?? undefined}
                isCaller={callState.isCaller ?? false}
                callStatus={callState.status}
              />
            </>
          )}
      </>
    )
  },
)

GlobalCallManager.displayName = "GlobalCallManager"

export default GlobalCallManager
