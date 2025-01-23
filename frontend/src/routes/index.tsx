import { Route, Routes as Routess } from "react-router-dom";
import Home from "../pages/Home";
import VideoCallPage from "../pages/VideoCallPage";
const Routes = () => {
    return (
        <Routess>
            <Route path="/" element={<Home />} />
            <Route path="/video-call" element={<VideoCallPage />} />
        </Routess>
    );
};
export default Routes;
