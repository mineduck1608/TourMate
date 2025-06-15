import React, { useEffect, useRef } from "react";
import { apiHub } from "@/types/constants";
import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

type Props = {
  type: "voice" | "video";
  conversationId: number;
  peerId: number; // id của người còn lại trong cuộc gọi
  currentAccountId: number; // id của chính mình
  onClose: () => void;
};

export default function CallModal({
  type,
  conversationId,
  peerId,
  currentAccountId,
  onClose,
}: Props) {
  const localVideo = useRef<HTMLVideoElement>(null);
  const remoteVideo = useRef<HTMLVideoElement>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const connection = useRef<HubConnection | null>(null);

  // Xác định caller: là người chủ động bấm gọi
  const isCaller = currentAccountId; // Quy ước: ai có id nhỏ hơn là caller, bạn có thể thay đổi logic này

  useEffect(() => {
    let localStream: MediaStream;

    // 1. Khởi tạo SignalR
    const hub = new HubConnectionBuilder()
      .withUrl(`${apiHub}/chatHub?conversationId=${conversationId}`)
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect()
      .build();

    connection.current = hub;

    // 2. Khởi tạo WebRTC peer connection
    peerConnection.current = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    // 3. Lấy stream từ camera/mic
    const getMedia = async () => {
      localStream = await navigator.mediaDevices.getUserMedia({
        video: type === "video",
        audio: true,
      });
      if (localVideo.current) localVideo.current.srcObject = localStream;
      localStream.getTracks().forEach((track) => {
        peerConnection.current?.addTrack(track, localStream);
      });
    };

    // 4. Xử lý nhận stream remote
    peerConnection.current.ontrack = (event) => {
      if (remoteVideo.current) {
        remoteVideo.current.srcObject = event.streams[0];
      }
    };

    // 5. Xử lý ICE candidate
    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate && peerId) {
        hub.invoke("SendIceCandidate", conversationId, peerId, event.candidate);
      }
    };

    // 6. Xử lý nhận offer/answer/candidate từ SignalR
    hub.on("receiveoffer", async (toAccountId, offer) => {
      if (toAccountId === currentAccountId) {
        await peerConnection.current?.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peerConnection.current?.createAnswer();
        await peerConnection.current?.setLocalDescription(answer);
        hub.invoke("SendAnswer", conversationId, peerId, answer);
      }
    });

    hub.on("receiveanswer", async (toAccountId, answer) => {
      if (toAccountId === currentAccountId) {
        await peerConnection.current?.setRemoteDescription(new RTCSessionDescription(answer));
      }
    });

    hub.on("receiveicecandidate", async (toAccountId, candidate) => {
      if (toAccountId === currentAccountId) {
        await peerConnection.current?.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    // 7. Bắt đầu kết nối
    hub.start().then(async () => {
      await getMedia();

      // Nếu là caller, tạo offer
      if (isCaller) {
        const offer = await peerConnection.current?.createOffer();
        await peerConnection.current?.setLocalDescription(offer);
        hub.invoke("SendOffer", conversationId, peerId, offer);
      }
    });

    return () => {
      hub.stop();
      peerConnection.current?.close();
      localStream?.getTracks().forEach((track) => track.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, conversationId, peerId, currentAccountId]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 flex flex-col items-center">
        <h2 className="text-xl font-bold mb-4">
          {type === "voice" ? "Đang gọi thoại..." : "Đang gọi video..."}
        </h2>
        <div className="flex gap-4">
          <video ref={localVideo} autoPlay muted className="w-32 h-32 bg-black rounded" />
          <video
            ref={remoteVideo}
            autoPlay
            className="w-32 h-32 bg-black rounded"
            style={{ display: type === "video" ? "block" : "none" }}
          />
        </div>
        <button
          onClick={onClose}
          className="mt-6 px-6 py-2 bg-red-500 text-white rounded-full"
        >
          Kết thúc
        </button>
      </div>
    </div>
  );
}