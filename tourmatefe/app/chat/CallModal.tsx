import React, { useEffect, useRef } from "react";
import { HubConnection } from "@microsoft/signalr";

type Props = {
    type: "voice" | "video";
    conversationId: number;
    peerId: number;
    currentAccountId: number;
    onClose: () => void;
    connection?: HubConnection;
    isCaller: boolean;
};

export default function CallModal({
    type,
    conversationId,
    peerId,
    currentAccountId,
    onClose,
    connection,
    isCaller
}: Props) {
    const localVideo = useRef<HTMLVideoElement>(null);
    const remoteVideo = useRef<HTMLVideoElement>(null);
    const peerConnection = useRef<RTCPeerConnection | null>(null);

    console.log("isCaller", currentAccountId, peerId, conversationId);
    useEffect(() => {
        if (!connection) return;

        let localStream: MediaStream;

        // 1. Khởi tạo WebRTC peer connection
        peerConnection.current = new RTCPeerConnection({
            iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        });

        // 2. Lấy stream từ camera/mic
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

        // 3. Nhận stream remote
        peerConnection.current.ontrack = (event) => {
            if (remoteVideo.current) {
                remoteVideo.current.srcObject = event.streams[0];
            }
        };

        // 4. ICE candidate
        peerConnection.current.onicecandidate = (event) => {
            if (event.candidate && peerId) {
                connection.invoke("SendIceCandidate", conversationId, peerId, event.candidate);
            }
        };

        // 5. Nhận offer/answer/candidate từ SignalR
        connection.on("ReceiveOffer", async (toAccountId, offer) => {
            if (toAccountId === currentAccountId) {
                await peerConnection.current?.setRemoteDescription(new RTCSessionDescription(offer));
                const answer = await peerConnection.current?.createAnswer();
                await peerConnection.current?.setLocalDescription(answer);
                connection.invoke("SendAnswer", conversationId, peerId, answer);
            }
        });

        connection.on("ReceiveAnswer", async (toAccountId, answer) => {
            if (toAccountId === currentAccountId) {
                await peerConnection.current?.setRemoteDescription(new RTCSessionDescription(answer));
            }
        });

        connection.on("ReceiveIceCandidate", async (toAccountId, candidate) => {
            if (toAccountId === currentAccountId) {
                await peerConnection.current?.addIceCandidate(new RTCIceCandidate(candidate));
            }
        });

        // 6. Bắt đầu media và gửi offer nếu là caller
        getMedia().then(async () => {
            // Khi là caller (người bấm gọi)
            if (isCaller) {
                const offer = await peerConnection.current?.createOffer();
                await peerConnection.current?.setLocalDescription(offer);
                console.log("SendOffer params:", conversationId, peerId, offer, currentAccountId, type);
                connection.invoke("SendOffer", conversationId, peerId, offer, currentAccountId, type);
            }
        });

        return () => {
            // Cleanup
            connection.off("ReceiveOffer");
            connection.off("ReceiveAnswer");
            connection.off("ReceiveIceCandidate");
            peerConnection.current?.close();
            localStream?.getTracks().forEach((track) => track.stop());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [type, conversationId, peerId, currentAccountId, connection]);

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