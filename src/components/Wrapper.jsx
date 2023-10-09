import { Routes, Route } from "react-router-dom";
import Mainboard from "./Mainboard";
import Authentication from "./Authentication";
import Profile from "./Profile/Profile";
import Credits from "./Credits"
import BadUrl from "./BadUrl";
import { useEffect } from "react";

const Wrapper = ({ path, isLogged, loadedPosts, setLoadedPosts, isCreatePostOpen, setIsCreatePostOpen, imageWindowState, setImageWindowState, postOrder, setPostOrder, mostLikedPosts, setMostLikedPosts }) => {
    return (
        <div className="Wrapper">
            <Routes>
                <Route path="/" element={<Mainboard isLogged={isLogged} loadedPosts={loadedPosts} setLoadedPosts={setLoadedPosts} isCreatePostOpen={isCreatePostOpen} setIsCreatePostOpen={setIsCreatePostOpen} imageWindowState={imageWindowState} setImageWindowState={setImageWindowState} postOrder={postOrder} setPostOrder={setPostOrder} mostLikedPosts={mostLikedPosts} setMostLikedPosts={setMostLikedPosts} />} />
                <Route path="/authenticate" element={<Authentication />} />
                <Route path="/profile/:usernameParam" element={<Profile imageWindowState={imageWindowState} setImageWindowState={setImageWindowState} />} />
                <Route path="/badUrl/:url" element={<BadUrl />} />
                <Route path="/credits" element={<Credits />} />
            </Routes>
        </div>
    );
}

export default Wrapper;