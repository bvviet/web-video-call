/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext, useEffect } from "react";
import { io } from "socket.io-client";

export const socket = io("http://localhost:5000", {
    autoConnect: false,
    path: "/socket.io",
    transports: ["polling"],
});

const SocketContext = createContext({} as any);

export const useModalContext = () => {
    return useContext(SocketContext);
};

const SocketProvider = ({ children }: any) => {
    useEffect(() => {
        socket.connect();

        socket.on("connect", () => {});

        socket.on("disconnect", () => {
            console.log("Disconnected to socket server");
        });

        return () => {
            socket.off("connect");
            socket.off("disconnect");
            socket.disconnect();
        };
    }, []);

    return <SocketContext.Provider value={{}}>{children}</SocketContext.Provider>;
};
export default SocketProvider;
