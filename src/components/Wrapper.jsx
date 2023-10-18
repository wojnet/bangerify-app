import { Routes, Route } from "react-router-dom";
import Mainboard from "./Mainboard";
import Authentication from "./Authentication";
import Profile from "../features/profile/Profile";
import Credits from "./Credits"
import BadUrl from "./BadUrl";

const Wrapper = ({ isCreatePostOpen, setIsCreatePostOpen }) => {
    return (
        <div className="Wrapper">
            <Routes>
                <Route path="/" element={<Mainboard isCreatePostOpen={isCreatePostOpen} setIsCreatePostOpen={setIsCreatePostOpen} />} />
                <Route path="/authenticate" element={<Authentication />} />
                <Route path="/profile/:usernameParam" element={<Profile />} />
                <Route path="/badUrl/:url" element={<BadUrl />} />
                <Route path="/credits" element={<Credits />} />
            </Routes>
        </div>
    );
}

export default Wrapper;