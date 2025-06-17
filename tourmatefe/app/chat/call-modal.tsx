"use client"

import { useEffect, useRef, useState } from "react"
import type { HubConnection } from "@microsoft/signalr"
import { PhoneOff, Mic, MicOff, Video, VideoOff } from "lucide-react"
import pako from "pako"

type Props = {
  type: "voice" | "video"
  conversationId: number
  peerId: number
  currentAccountId: number
  onClose: () => void
  connection?: HubConnection
  isCaller: boolean
  callStatus: "calling" | "connected"
}

type OfferDTO = {
  type: RTCSdpType
  sdp: string
}

type IceCandidateDTO = {
  candidate: string
  sdpMid: string
  sdpMLineIndex: number
}

// SDP compress/decompress
function compressSdp(sdp: string): string {
  const compressed = pako.deflate(sdp)
  const binaryString = Array.from(compressed)
    .map((b) => String.fromCharCode(b))
    .join("")
  return btoa(binaryString)
}

function decompressSdp(compressedSdp: string): string {
  const binary = atob(compressedSdp)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return pako.inflate(bytes, { to: "string" })
}

export default function CallModal({
  type,
  conversationId,
  peerId,
  currentAccountId,
  onClose,
  connection,
  isCaller,
  callStatus,
}: Props) {
  const localVideo = useRef<HTMLVideoElement>(null)
  const remoteVideo = useRef<HTMLVideoElement>(null)
  const remoteAudio = useRef<HTMLAudioElement>(null)
  const peerConnection = useRef<RTCPeerConnection | null>(null)
  const localStreamRef = useRef<MediaStream | null>(null)
  const pendingCandidates = useRef<RTCIceCandidateInit[]>([])
  const [connectionStatus, setConnectionStatus] = useState("Đang kết nối...")
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [mediaReady, setMediaReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!connection) {
      setError("Không có kết nối SignalR")
      return
    }

    let isCleanedUp = false

    const setupWebRTC = async () => {
      try {
        // 🔧 TURN Server — KHÔNG dùng STUN nếu NAT khó
        peerConnection.current = new RTCPeerConnection({
          iceServers: [
            {
              urls: "turn:global.relay.metered.ca:80",
              username: "openai",
              credential: "webrtc"
            }
          ]
        })

        const pc = peerConnection.current

        // 🎧 Khi nhận remote stream
        pc.ontrack = (event) => {
          if (event.streams[0] && !isCleanedUp) {
            console.log("🎵 Remote stream:", event.streams[0])
            if (remoteAudio.current) {
              remoteAudio.current.srcObject = event.streams[0]
              remoteAudio.current.muted = false // quan trọng
              remoteAudio.current
                .play()
                .then(() => console.log("🔊 Remote audio playing"))
                .catch((e) => {
                  console.warn("🔈 Autoplay blocked, waiting for click")
                  document.addEventListener("click", () => {
                    remoteAudio.current?.play()
                  }, { once: true })
                })
            }
          }
        }

        // 🧊 ICE Candidate
        pc.onicecandidate = async (event) => {
          if (event.candidate && !isCleanedUp) {
            await connection.invoke("SendIceCandidate", conversationId, peerId, event.candidate)
          }
        }

        // 📡 Trạng thái ICE
        pc.oniceconnectionstatechange = () => {
          console.log("🔁 ICE state:", pc.iceConnectionState)
          if (pc.iceConnectionState === "connected") setConnectionStatus("Đã kết nối")
          if (pc.iceConnectionState === "failed") setError("Kết nối thất bại")
        }

        // 🎙️ Lấy mic
        const stream = await navigator.mediaDevices.getUserMedia({
          video: false,
          audio: { echoCancellation: true, noiseSuppression: true }
        })

        if (isCleanedUp) {
          stream.getTracks().forEach((t) => t.stop())
          return
        }

        // ✅ Gán vào local ref
        localStreamRef.current = stream

        // 🛑 Tắt phát local stream nếu đang gán nhầm
        if (remoteAudio.current) remoteAudio.current.muted = true

        // 🎤 Add track vào peerConnection
        stream.getTracks().forEach((track) => pc.addTrack(track, stream))

        setMediaReady(true)
        setConnectionStatus(isCaller ? "Đang gọi..." : "Đang kết nối...")

        if (isCaller) {
          await new Promise((r) => setTimeout(r, 300))
          const offer = await pc.createOffer({ offerToReceiveAudio: true })
          await pc.setLocalDescription(offer)
          await connection.invoke("SendOffer", conversationId, peerId, {
            type: offer.type,
            sdp: compressSdp(offer.sdp || "")
          }, currentAccountId, "voice")
        }
      } catch (err) {
        console.error(err)
        setError("Không thể truy cập microphone")
      }
    }

    // 🚀 Setup WebRTC
    setupWebRTC()

    // 🧹 Cleanup
    return () => {
      isCleanedUp = true
      peerConnection.current?.close()
      peerConnection.current = null
      localStreamRef.current?.getTracks().forEach((t) => t.stop())
    }
  }, [conversationId, peerId, currentAccountId, connection, isCaller])


  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
        setIsMuted(!audioTrack.enabled)
        console.log(`🎤 Audio ${audioTrack.enabled ? "enabled" : "disabled"}`)
      }
    }
  }

  const toggleVideo = () => {
    if (localStreamRef.current && type === "video") {
      const videoTrack = localStreamRef.current.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled
        setIsVideoOff(!videoTrack.enabled)
        console.log(`🎥 Video ${videoTrack.enabled ? "enabled" : "disabled"}`)
      }
    }
  }

  const handleEndCall = () => {
    console.log("📞 Ending call...")
    peerConnection.current?.close()
    localStreamRef.current?.getTracks().forEach((track) => track.stop())
    onClose()
  }

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 flex flex-col items-center max-w-4xl w-full mx-4 shadow-2xl border border-gray-300 transition-all duration-300">
        {/* Hidden audio element for voice calls */}
        {type === "voice" && (
          <audio
            ref={remoteAudio}
            autoPlay
            playsInline
            controls={false}
            style={{ display: "none" }}
            onLoadedMetadata={() => console.log("🎵 Remote audio metadata loaded")}
            onPlay={() => console.log("🎵 Remote audio started playing")}
            onError={(e) => console.error("🎵 Remote audio error:", e)}
          />
        )}

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2 text-gray-900">
            {type === "voice" ? "Cuộc gọi thoại" : "Cuộc gọi video"}
          </h2>
          <div className="text-lg text-gray-500">{connectionStatus}</div>
          {error && <div className="text-red-600 mt-2 bg-red-100 p-2 rounded">{error}</div>}
          <div className="text-sm text-gray-500 mt-2">
            {isCaller ? "Bạn đang gọi" : "Bạn đang nhận cuộc gọi"} | Media: {mediaReady ? "✅" : "⏳"}
          </div>
        </div>

        {/* Video Container */}
        {type === "video" && (
          <div className="flex gap-4 mb-6 w-full max-w-4xl">
            {/* Local Video */}
            <div className="flex-1 relative bg-gray-200 rounded-lg overflow-hidden aspect-video shadow-lg">
              <video
                ref={localVideo}
                autoPlay
                muted
                playsInline
                className={`w-full h-full object-cover ${isVideoOff ? "hidden" : "block"}`}
              />
              {isVideoOff && (
                <div className="w-full h-full flex items-center justify-center bg-gray-300">
                  <VideoOff className="w-12 h-12 text-gray-500" />
                </div>
              )}
              <div className="absolute bottom-2 left-2 text-sm bg-black bg-opacity-30 text-white px-2 py-1 rounded">
                Bạn
              </div>
            </div>

            {/* Remote Video */}
            <div className="flex-1 relative bg-gray-200 rounded-lg overflow-hidden aspect-video shadow-lg">
              <video
                ref={remoteVideo}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
                onLoadedMetadata={() => console.log("🎥 Remote video metadata loaded")}
                onPlay={() => console.log("🎥 Remote video started playing")}
              />
              <div className="absolute bottom-2 left-2 text-sm bg-black bg-opacity-30 text-white px-2 py-1 rounded">
                Đối phương
              </div>
              {!remoteVideo.current?.srcObject && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-500">Đang chờ video...</div>
              )}
            </div>
          </div>
        )}

        {/* Voice Call Display */}
        {type === "voice" && (
          <div className="mb-8">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center mb-4 shadow-lg">
              <div className="text-6xl">🎵</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">Cuộc gọi thoại</div>
              <div className="text-sm text-gray-500 mt-1">
                {remoteAudio.current?.srcObject ? "Đang phát âm thanh" : "Đang chờ âm thanh..."}
              </div>
              {/* Add audio debug info */}
              <div className="text-xs text-gray-400 mt-1">
                Audio: {remoteAudio.current?.paused === false ? "Playing" : "Paused"} | Volume:{" "}
                {remoteAudio.current?.volume || 0}
              </div>
            </div>
          </div>
        )}

        {/* Add this after the Voice Call Display section */}
        {/* {type === "voice" && remoteAudio.current?.srcObject && (
          <button
            onClick={() => {
              remoteAudio.current
                ?.play()
                .then(() => {
                  console.log("🎵 Manual audio play successful")
                })
                .catch((error) => {
                  console.error("🎵 Manual audio play failed:", error)
                })
            }}
            className="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            🔊 Test Audio Play
          </button>
        )} */}

        {/* Controls */}
        <div className="flex gap-4 items-center">
          {/* Mute Button */}
          <button
            onClick={toggleMute}
            className={`p-4 rounded-full transition-colors ${isMuted ? "bg-red-500 hover:bg-red-600" : "bg-gray-500 hover:bg-gray-600"}`}
            title={isMuted ? "Bật mic" : "Tắt mic"}
          >
            {isMuted ? <MicOff className="w-6 h-6 text-white" /> : <Mic className="w-6 h-6 text-white" />}
          </button>

          {/* Video Toggle (only for video calls) */}
          {type === "video" && (
            <button
              onClick={toggleVideo}
              className={`p-4 rounded-full transition-colors ${isVideoOff ? "bg-red-500 hover:bg-red-600" : "bg-gray-500 hover:bg-gray-600"}`}
              title={isVideoOff ? "Bật camera" : "Tắt camera"}
            >
              {isVideoOff ? <VideoOff className="w-6 h-6 text-white" /> : <Video className="w-6 h-6 text-white" />}
            </button>
          )}

          {/* End Call Button */}
          <button
            onClick={handleEndCall}
            className="p-4 bg-red-500 hover:bg-red-600 rounded-full transition-colors"
            title="Kết thúc cuộc gọi"
          >
            <PhoneOff className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>
    </div>
  )
}
