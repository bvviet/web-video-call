import { SendOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { socket } from "../../context/SocketProvider";
import axios from "axios";
import dayjs from "dayjs";
import { IMessage } from "../../types/message";
interface IChatProps {
    roomId: string;
    senderId: string | undefined;
    receiverId: string | null;
}
const Chat: React.FC<IChatProps> = ({ roomId, senderId, receiverId }) => {
    const [messages, setMessages] = useState<IMessage>();
    const [valueInput, setValueInput] = useState<string>("");
    const fetchMessages = React.useCallback(async () => {
        try {
            const response = await axios.get(`http://localhost:5000/messages/${roomId}`);
            setMessages(response.data);
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    }, [roomId]);
    useEffect(() => {
        fetchMessages();

        socket.on("receive-message", () => {
            fetchMessages();
        });

        return () => {
            socket.off("receive-message");
        };
    }, [roomId, fetchMessages]);
    const handleSendMessage = () => {
        socket.emit("send-message", { roomId, senderId, receiverId, message: valueInput });
        fetchMessages();
    };
    console.log({ messages });

    return (
        <div className="text-[#202124] h-full">
            <div className="p-6 h-full overflow-y-auto">
                <p className="text-[1.125rem]">Tin nhắn trong cuộc gọi</p>
                <div className="mt-5 flex flex-col gap-3">
                    {messages?.data.map((message) => (
                        <div key={message._id} className="text-[#202124]">
                            <p>{message.senderId === senderId && "Bạn"}</p>
                            {message.message}
                            <span className="italic ml-2">{dayjs(message.createdAt).format("HH:mm")}</span>
                            <hr />
                        </div>
                    ))}
                </div>
            </div>

            <div className="absolute bottom-0 w-full p-3">
                <div className="flex w-full items-center border border-[#202124] bg-[#f1f3f4] rounded-2xl py-2 px-3 gap-2">
                    <textarea
                        onChange={(e) => setValueInput(e.target.value)}
                        rows={1}
                        placeholder="Gửi tin nhắn cho mọi người"
                        className="w-full border-none bg-transparent focus:outline-none focus:border-none"
                    ></textarea>
                    <button
                        onClick={handleSendMessage}
                        className="border-none flex items-center justify-center bg-transparent"
                    >
                        <SendOutlined style={{ fontSize: "16px" }} />
                    </button>
                </div>
            </div>
        </div>
    );
};
export default Chat;
