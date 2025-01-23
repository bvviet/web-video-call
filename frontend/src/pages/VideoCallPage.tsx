import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router";
import axios from "axios";
import dayjs from "dayjs";
import ReactPlayer from "react-player";
import { Button, Tooltip } from "antd";
import toast from "react-hot-toast";
import {
    DeleteOutlined,
    InfoCircleOutlined,
    MessageOutlined,
    PhoneOutlined,
    TeamOutlined,
    VideoCameraOutlined,
} from "@ant-design/icons";
import { socket } from "../context/SocketProvider";
import { IRoom } from "../types/room";
import { handleDeleteRoom, onCopy } from "../services";
import Chat from "../components/chat";

const VideoCallPage = () => {
    const [room, setRoom] = useState<IRoom>();
    const { state } = useLocation();
    const roomId = state?.roomId;
    const navigate = useNavigate();
    const [myStream, setMyStream] = useState<MediaStream>();
    const [remoteStream, setRemoteStream] = useState<MediaStream>();
    const streamRef = useRef<MediaStream | null>(null);
    const pcRef = useRef<RTCPeerConnection | null>(null);
    const [remoteSocketId, setRemoteSocketId] = useState<string | null>(null);

    useEffect(() => {
        const fetchRoomDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/rooms/${roomId}`);
                setRoom(response.data);
            } catch (error) {
                if (axios.isAxiosError(error) && error.response?.status === 404) navigate("/");
                console.error("Error fetching room details:", error);
            }
        };

        fetchRoomDetails();

        socket.on("connect", () => {
            console.log("Đã kết nối lại");
            socket.emit("join-room", roomId);
        });

        socket.on("user-joined", ({ socketId }) => {
            setRemoteSocketId(socketId);
            toast.success("User joined:", socketId);
        });

        socket.on("offer", async ({ offer, from }) => {
            console.log("Đã nhận offer từ:", from);
            setRemoteSocketId(from);
            await handleOffer(offer, from);
        });

        socket.on("answer", async (data) => {
            console.log("Đã nhận answer từ:", data.from);
            await handleAnswer(data.answer);
        });

        socket.on("ice-candidate", (candidate) => {
            console.log("Đã nhận ICE candidate từ:", candidate);
            addIceCandidate(candidate);
        });

        socket.on("user-left", ({ socketId }) => {
            toast.success(`Người dùng ${socketId} đã rời khỏi cuộc gọi`);
        });

        return () => {
            socket.off("connect");
            socket.off("user-joined");
            socket.off("offer");
            socket.off("answer");
            socket.off("ice-candidate");
            socket.off("user-left");
        };
    }, [roomId, navigate]);

    const createOffer = async () => {
        const pc = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] });
        pcRef.current = pc;

        // Add media
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        stream.getTracks().forEach((track) => pc.addTrack(track, stream));
        setMyStream(stream);
        streamRef.current = stream;

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit("ice-candidate", { candidate: event.candidate, to: remoteSocketId });
            }
        };

        try {
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            socket.emit("offer", { offer, from: socket.id, to: remoteSocketId });
        } catch (error) {
            console.error("Error creating offer:", error);
        }
    };

    const handleOffer = async (offer: RTCSessionDescriptionInit, from: string) => {
        const pc = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] });
        pcRef.current = pc;
        pc.ontrack = (event) => {
            const remoteStream = event.streams[0];
            setRemoteStream(remoteStream);
        };
        try {
            await pc.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            socket.emit("answer", { answer, to: from });
        } catch (error) {
            console.error("Error handling offer:", error);
        }
    };

    // Handle receiving answer
    const handleAnswer = async (answer: RTCSessionDescriptionInit) => {
        const pc = pcRef.current;
        if (pc) {
            try {
                await pc.setRemoteDescription(new RTCSessionDescription(answer));
            } catch (error) {
                console.error("Error setting remote description for answer:", error);
            }
        }
    };

    // Add ICE candidate
    const addIceCandidate = (candidate: RTCIceCandidateInit) => {
        console.log(" ICE candidate:", candidate);

        const pc = pcRef.current;
        if (pc) {
            pc.addIceCandidate(new RTCIceCandidate(candidate))
                .then(() => console.log("ICE candidate added"))
                .catch((error) => console.error("Error adding ICE candidate", error));
        }
    };

    const handleLeaveRoom = () => {
        pcRef.current?.close();
        socket.emit("leave-room", roomId);
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
        }
        navigate("/");
    };
    console.log({ remoteSocketId });
    console.log("sender", socket.id);

    return (
        <div className="relative bg-black h-screen flex flex-col justify-between">
            <div>
                <div className="absolute bottom-[80px] top-[50px] left-[130px] right-[130px]">
                    {/* My stream */}
                    <div className="w-full h-full">
                        {myStream && <ReactPlayer url={myStream} playing height={"100%"} width={"100%"} />}
                        {remoteStream && (
                            <ReactPlayer url={remoteStream} playing={true} height={"100%"} width={"100%"} />
                        )}
                    </div>
                </div>
                <div className="absolute bottom-[81px] top-[30px] right-[20px] bg-white w-[300px] rounded-lg">
                    <Chat roomId={roomId} senderId={socket.id} receiverId={remoteSocketId} />
                </div>
            </div>

            {/* Footer */}
            <div className="bg-[#202124] absolute bottom-0 w-full">
                <div className="flex px-6 items-center py-3 text-white justify-between">
                    <div className="flex gap-2 items-center">
                        <p>{dayjs(room?.data?.createdAt).format("HH:mm")}</p> |
                        <p onClick={onCopy} className="cursor-pointer myId w-[110px] truncate">
                            {room?.data?.roomId}
                        </p>
                    </div>
                    <div className="flex gap-2 items-center">
                        <Tooltip title={"Xóa phòng"}>
                            <Button
                                icon={<DeleteOutlined style={{ fontSize: "20px" }} />}
                                type="primary"
                                danger
                                onClick={() => {
                                    if (room?.data.roomId) {
                                        handleDeleteRoom({ roomId: room?.data.roomId }, navigate);
                                    }
                                }}
                                className="!py-5 !px-10 rounded-3xl"
                            ></Button>
                        </Tooltip>
                        <Tooltip title={"Rời khỏi cuộc gọi"}>
                            <Button
                                icon={<PhoneOutlined style={{ fontSize: "30px" }} />}
                                type="primary"
                                danger
                                onClick={() => handleLeaveRoom()}
                                className="!py-5 !px-10 rounded-3xl"
                            ></Button>
                        </Tooltip>
                        <Tooltip title={"Phát video"}>
                            <Button
                                onClick={createOffer}
                                icon={<VideoCameraOutlined style={{ fontSize: "20px" }} />}
                                className="!py-5 !px-10 rounded-3xl"
                            ></Button>
                        </Tooltip>
                    </div>
                    <div className="flex gap-3">
                        <InfoCircleOutlined style={{ fontSize: "22px" }} />
                        <TeamOutlined style={{ fontSize: "22px" }} />
                        <MessageOutlined style={{ fontSize: "22px" }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoCallPage;
