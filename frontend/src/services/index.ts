import axios from "axios";
import toast from "react-hot-toast";

export const onCopy = () => {
    const copyText = document.querySelector(".myId") as HTMLParagraphElement;
    if (copyText) {
        navigator.clipboard
            .writeText(copyText.innerText)
            .then(() => toast.success("Copy mã phòng thành công"))
            .catch((err) => console.error("Failed to copy:", err));
    }
};

export const handleDeleteRoom = async ({ roomId }: { roomId: string }, navigate: (path: string) => void) => {
    try {
        await axios.delete(`http://localhost:5000/rooms/${roomId}`);
        toast.success("Room deleted successfully");
        navigate("/");
    } catch (error) {
        console.error("Error deleting room:", error);
    }
};
