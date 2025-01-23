import { Router } from "express";
import room from "../Controllers/room.js";
const roomRouter = Router();

roomRouter.get("/:roomId", room.getDetailRoom);
roomRouter.delete("/:roomId", room.deleteRoom);
export default roomRouter;
