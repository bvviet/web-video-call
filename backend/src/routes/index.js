import { Router } from "express";
import roomRouter from "./room.js";
import chatRouter from "./chat.js";
const router = Router();

router.get("/", (req, res) => {
    res.send("Hello World");
});
router.use("/rooms", roomRouter);
router.use("/messages", chatRouter);

export default router;
