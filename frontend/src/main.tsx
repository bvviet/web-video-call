import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import SocketProvider from "./context/SocketProvider.tsx";
import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from "react-hot-toast";
createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <SocketProvider>
            <Router>
                <Toaster />
                <App />
            </Router>
        </SocketProvider>
    </StrictMode>
);
