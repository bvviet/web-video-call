import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema({
    roomId: { type: String, required: true },
    senderId: { type: String, required: true },
    receiverId: { type: String, required: true },
    message: { type: String },
    createdAt: { type: Date, default: Date.now },
});

const Chat = mongoose.model("Chat", ChatSchema);

export default Chat;
