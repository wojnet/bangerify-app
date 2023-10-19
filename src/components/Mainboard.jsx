import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { throttle } from "underscore";
import Article from "../features/posts/Article";
import CreatePost from "../features/modals/createPost/CreatePost";
import Cat from "../assets/cat.png";

import { loadPosts, resetPosts, setAddedLikes } from "../features/posts/postsSlice";

const Mainboard = ({ isCreatePostOpen, setIsCreatePostOpen }) => {
    const dispatch = useDispatch();

    const username = useSelector((state) => state.global.username);
    const isLogged = useSelector((state) => state.global.isLogged);

    const posts = useSelector((state) => state.posts.posts);
    const postsEnded = useSelector((state) => state.posts.postsEnded);
    const canLoad = useSelector((state) => state.posts.canLoad);
    const loading = useSelector((state) => state.posts.loading);
    const loadPostsBottomMargin = useSelector((state) => state.globalSettings.loadPostsBottomMargin);

    // TEMP STORAGE FOR POST CREATION MODAL
    const [newPostImages, setNewPostImages] = useState([]);
    const [newPostData, setNewPostData] = useState({ 
        post: ""
    });

    const handlePostLoading = (e) => {
        e.preventDefault();
        if (window.innerHeight + document.documentElement.scrollTop >= document.scrollingElement.scrollHeight - loadPostsBottomMargin) {
            if (canLoad) {
                dispatch(loadPosts());
            }
        }
    }

    const handlePostLoadingThrottled = throttle(handlePostLoading, 500);

    const handleSetAddedLikes = (id, number) => {
        dispatch(setAddedLikes({id, number}));
    }

    useEffect(() => {
        dispatch(resetPosts());
        window.addEventListener("scroll", handlePostLoadingThrottled);

        dispatch(loadPosts());

        return () => {
            window.removeEventListener("scroll", handlePostLoadingThrottled);
            dispatch(resetPosts());
        }
    }, []);

    const postElements = posts.map(e => <Article key={e.id} id={e.id} postVisibleName={e.visible_name} utcDate={e.date} text={e.text} postUsername={e.username} images={e.images} profilePictureUrl={e.profilePictureUrl} username={username} grade={e.grade} isLogged={isLogged} likes={e.likes} isLiked={e.isLiked} addedLikes={e.addedLikes} setAddedLikes={handleSetAddedLikes} />);

    return (
        <div className="Mainboard">
            <CreatePost isCreatePostOpen={isCreatePostOpen} setIsCreatePostOpen={setIsCreatePostOpen} newPostData={newPostData} setNewPostData={setNewPostData} newPostImages={newPostImages} setNewPostImages={setNewPostImages} />
            { isLogged && <>
                <img src={Cat} alt="cat" style={{ width: "100px" }} />
                <h2 style={{ margin: 0, textAlign: "center" }}>Hello {username}! 👋</h2>
                <p style={{ textAlign: "center", width: "60%", color: "var(--gray)" }}>Thanks for using Bangerify! You can send your feedback by credits tab on navbar.</p>
            </> }
            
            { isLogged && <button 
                className="Button1"
                onClick={() => setIsCreatePostOpen(true)}
            >ADD POST 📰</button> }

            { posts.error && <p>{ posts.error }</p> }
            { postElements }<br />
        </div>
    );
}

export default Mainboard;