import { Routes, Route } from "react-router-dom";
import Mainboard from "./Mainboard";
import Authentication from "./Authentication";
import Profile from "./Profile";
import Credits from "./Credits"
import BadUrl from "./BadUrl";
import { useEffect } from "react";

const Wrapper = ({ path, setPath, isLogged, loadedPosts, setLoadedPosts, username, isCreatePostOpen, setIsCreatePostOpen, imageWindowState, setImageWindowState, postOrder, setPostOrder, mostLikedPosts, setMostLikedPosts }) => {

    useEffect(() => {
        console.log("W R A P P E R");
    }, []);

    return (
        <div className="Wrapper">
            <Routes>
                <Route path="/" element={<Mainboard isLogged={isLogged} loadedPosts={loadedPosts} setLoadedPosts={setLoadedPosts} username={username} isCreatePostOpen={isCreatePostOpen} setIsCreatePostOpen={setIsCreatePostOpen} imageWindowState={imageWindowState} setImageWindowState={setImageWindowState} postOrder={postOrder} setPostOrder={setPostOrder} mostLikedPosts={mostLikedPosts} setMostLikedPosts={setMostLikedPosts} />} />
                <Route path="/authenticate" element={<Authentication />} />
                <Route path="/profile/:usernameParam" element={<Profile username={username} imageWindowState={imageWindowState} setImageWindowState={setImageWindowState} />} />
                <Route path="/badUrl/:url" element={<BadUrl />} />
                <Route path="/credits" element={<Credits username={username} />} />
            </Routes>
        </div>
    );
}

export default Wrapper;