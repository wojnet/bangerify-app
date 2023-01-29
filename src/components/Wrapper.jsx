import { Routes, Route } from "react-router-dom";
import Mainboard from "./Mainboard";
import Authentication from "./Authentication";
import Profile from "./Profile";
import Credits from "./Credits"
import BadUrl from "./BadUrl";

const Wrapper = ({ path, setPath, isLogged, loadedPosts, setLoadedPosts, username, isCreatePostOpen, setIsCreatePostOpen }) => {
    return (
        <div className="Wrapper">
            <Routes>
                <Route path="/" element={<Mainboard isLogged={isLogged} loadedPosts={loadedPosts} setLoadedPosts={setLoadedPosts} username={username} isCreatePostOpen={isCreatePostOpen} setIsCreatePostOpen={setIsCreatePostOpen} />} />
                <Route path="/authenticate" element={<Authentication />} />
                <Route path="/profile/:usernameParam" element={<Profile username={username} />} />
                <Route path="/badUrl/:url" element={<BadUrl />} />
                <Route path="/credits" element={<Credits />} />
            </Routes>
        </div>
    );
}

export default Wrapper;