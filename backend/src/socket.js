import { Server } from "socket.io";
import Room from "./Models/room.js";
import Chat from "./Models/Chat.js";

export default (httpServer) => {
    const io = new Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
            credentials: true,
        },
    });

    io.on("connection", (socket) => {
        console.log("A user connected", socket.id);

        socket.on("create-room", async (roomId) => {
            const existingRoom = await Room.findOne({ roomId });
            if (!existingRoom) {
                const newRoom = new Room({ roomId });
                await newRoom.save();
                socket.join(roomId);
            } else {
                console.log("Room already exists");
            }
        });

        socket.on("check-room", async (roomId, callback) => {
            console.log(roomId);

            const room = await Room.findOne({ roomId });
            callback(!!room);
        });

        socket.on("join-room", async (roomId) => {
            const room = await Room.findOne({ roomId });
            if (room) {
                socket.join(roomId);
                console.log(`User ${socket.id} joined room: ${roomId}`);
                socket.to(roomId).emit("user-joined", { socketId: socket.id });
            } else {
                console.log("Room not found.");
                socket.emit("room-not-found", "Room does not exist");
            }
        });

        socket.on("leave-room", (roomId) => {
            socket.leave(roomId);
            socket.to(roomId).emit("user-left", { socketId: socket.id });
        });

        socket.on("offer", (data) => {
            console.log("Server nhận được offer từ:", data.from, "gửi tới:", data.to, data);
            socket.to(data.to).emit("offer", { offer: data.offer, from: data.from });
        });

        socket.on("answer", (data) => {
            console.log("Server nhận answer từ:", socket.id, "đến:", data.to);
            socket.to(data.to).emit("answer", { answer: data.answer, from: socket.id });
        });

        socket.on("ice-candidate", (data) => {
            console.log("ICE candidate received:", data);
            socket.to(data.to).emit("ice-candidate", data.candidate);
        });

        // ------------------------------------- Chat -------------------------------------
        socket.on("send-message", async ({ roomId, senderId, receiverId, message }) => {
            if (receiverId && senderId) {
                const newMessage = new Chat({ roomId, senderId, receiverId, message });
                await newMessage.save();
                io.to(receiverId).emit("receive-message", { senderId, message });
            } else {
                console.log("Not receiverId");
            }
        });

        socket.on("disconnect", () => {
            console.log("A user disconnected");
        });
    });
};
