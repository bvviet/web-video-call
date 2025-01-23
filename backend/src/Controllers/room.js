import Room from "../Models/room.js";

class roomController {
    async getDetailRoom(req, res) {
        try {
            const { roomId } = req.params;
            const room = await Room.findOne({ roomId });
            if (!room) {
                return res.status(404).json({ message: "Not found room" });
            }
            return res.status(200).json({
                message: "Success",
                data: room,
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async deleteRoom(req, res) {
        try {
            const { roomId } = req.params;
            const room = await Room.findOneAndDelete({ roomId });
            if (!room) {
                return res.status(404).json({ message: "Not found room" });
            }
            return res.status(200).json({ message: "Room deleted successfully", room });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}
export default new roomController();
