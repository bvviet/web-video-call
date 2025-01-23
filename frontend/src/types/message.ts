export interface IMessage {
    data: {
        _id: string;
        createdAt: string;
        message: string;
        receiverId: string;
        roomId: string;
        senderId: string;
    }[];
    message: string;
}
