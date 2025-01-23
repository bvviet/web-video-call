import { Button } from "antd";
import { TagOutlined, VideoCameraAddOutlined } from "@ant-design/icons";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import { useNavigate } from "react-router";
import { socket } from "../context/SocketProvider";
import { Input } from "antd";
import toast from "react-hot-toast";

function Home() {
    const [idRoom, setIdRoom] = useState<string | null>(null);
    const navigate = useNavigate();

    const createRoom = () => {
        const roomId = uuidv4();
        socket.emit("create-room", roomId);
        if (roomId) {
            navigate("/video-call", { state: { roomId } });
        }
    };

    const joinRoom = () => {
        if (idRoom) {
            socket.emit("check-room", idRoom, (exists: boolean) => {
                if (exists) {
                    socket.emit("join-room", idRoom);
                    navigate("/video-call", { state: { roomId: idRoom } });
                } else {
                    toast.error("Phòng không tồn tại");
                }
            });
        } else {
            toast.error("Mã phòng không được để trống");
        }
    };

    return (
        <div className="h-screen flex flex-col justify-center items-center sm:px-20 px-7">
            <div className="gap-5 grid xl:grid-cols-2 grid-cols-1 items-center gap-10">
                <div>
                    <h1 className="text-[30px] md:text-[45px] text-left mb-2">
                        Tính năng họp và gọi video dành cho tất cả mọi người
                    </h1>
                    <div className="text-left">
                        <p className="text-[22px] leading-[1.75rem]">Kết nối, cộng tác và ăn mừng ở mọi nơi với </p>
                        <p className="text-[#444746] leading-[1.75rem] text-[1.375rem] mt-1">Google Meet</p>
                    </div>
                    <div className="flex gap-3 mt-8">
                        <Button
                            type="primary"
                            icon={<VideoCameraAddOutlined style={{ fontSize: "16px" }} />}
                            onClick={createRoom}
                            className="rounded-2xl !py-5 font-medium"
                        >
                            Tạo phòng mới
                        </Button>
                        <div className="flex gap-3 items-center">
                            <Input
                                prefix={<TagOutlined />}
                                placeholder="Nhập mã phòng"
                                value={idRoom ?? ""}
                                onChange={(e) => setIdRoom(e.target.value)}
                                className="rounded-2xl border-[2px] py-2 placeholder:text-[20px]"
                            />
                            <Button type="text" onClick={joinRoom} className="font-medium opacity-80">
                                Tham gia
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="flex gap-3 items-center flex-col">
                    <div className="w-[360px]">
                        <img
                            src="https://www.gstatic.com/meet/user_edu_get_a_link_light_90698cd7b4ca04d3005c962a3756c42d.svg"
                            alt=""
                            className="w-[247px] h-[247px] mx-auto"
                        />
                        <div className="mt-10">
                            <p className="text-[1.5rem] leading-[2rem]">Nhận đường liên kết bạn có thể chia sẻ</p>
                            <p className="mt-2">
                                Nhấp vào <strong>Cuộc họp mới</strong> để nhận đường liên kết mà bạn có thể gửi cho
                                những người mình muốn họp cùng
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
