import Chat from "../Models/Chat.js";
class chatsController {
    async getAllChats(req, res) {
        try {
            const { roomId } = req.params;
            if (!roomId) {
                return res.status(400).json({ message: "roomId là bắt buộc" });
            }
            const chats = await Chat.find({ roomId }).sort({ createdAt: 1 });
            return res.status(200).json({
                message: "Success",
                data: chats,
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}
export default new chatsController();
