import express from "express";
import socket from "./socket.js";
import { createServer } from "http";
import mongoose from "mongoose";
import router from "./routes/index.js";
import cors from "cors";

const app = express();
const port = 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);
app.use("/", router);

const httpServer = createServer(app);
socket(httpServer);

httpServer.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`);
});

const connectDb = async () => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/web-stream");
        console.log("connected database");
    } catch (error) {
        console.error("Error connecting to MongoDB", error);
    }
};
connectDb();
