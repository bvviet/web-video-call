import { Router } from "express";
import chats from "../Controllers/chats.js";
const chatRouter = Router();

chatRouter.get("/:roomId", chats.getAllChats);
export default chatRouter;
