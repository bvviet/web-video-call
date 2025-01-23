import mongoose from "mongoose";
const Schema = mongoose.Schema;

const roomSchema = new Schema({
    roomId: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now },
});

const Room = mongoose.model("Room", roomSchema);

export default Room;
