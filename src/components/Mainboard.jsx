import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import Article from "./Article/Article";
import CreatePost from "./Modals/CreatePost";
import Cat from "../assets/cat.png";

import { loadPosts, resetPosts } from "../features/posts/postsSlice";
import { loadPostGateway } from "../helpers/Gateway";

const Mainboard = ({ setLoadedPosts, isCreatePostOpen, setIsCreatePostOpen, postOrder, setPostOrder, mostLikedPosts, setMostLikedPosts }) => {
    const dispatch = useDispatch();

    const username = useSelector((state) => state.global.username);
    const isLogged = useSelector((state) => state.global.isLogged);
    
    // const [mostLikedPostsEnded, setMostLikedPostsEnded] = useState(false);

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

    // 0. latest; 1. most liked
    // const loadPosts = async (_reset) => {
    //     switch(postOrder) {
    //         case 0:
    //             await axios.post(`${process.env.BACKEND_URL}/api/getPosts`, { lastPostId: _reset === "reset" ? 99999999 : loadedPosts.lastPostId })
    //                 .then(res => {
    //                     let postsArray = res.data;
    //                     if(postsArray.length !== 0) {
    //                         setLoadedPosts(prev => {
    //                             let newObj = { ...prev };
    //                             let ids = Array.from(postsArray ? postsArray : []).map(e => e.id);
    //                             newObj.lastPostId = ids.at(-1);
    //                             newObj.lastTimeRefreshed = new Date().getTime();
    //                             newObj.posts = [...newObj.posts, ...Array.from(postsArray ? postsArray : [])];
    //                             return newObj;
    //                         });
    //                     }
    //                 })
    //                 .then(() => setCanLoadPosts(false))
    //                 .catch(err => console.log(err));
    //             break;
    //         case 1:
    //             // mostLikedPosts
    //             var result;
                
    //             if (postOrder === 1 && !mostLikedPosts.posts.length) {
    //                 result = await axios.get(`${process.env.BACKEND_URL}/api/getMostLikedPostsList`).then(res => res.data);
    //                 setMostLikedPosts(prev => {
    //                     return {...prev, posts: result};
    //                 });
    //             } else {
    //                 result = mostLikedPosts.posts;
    //             }

    //             await axios.post(`${process.env.BACKEND_URL}/api/getPostsById`, { list: result.slice(mostLikedPosts.index, mostLikedPosts.index + 20 < result.length ? mostLikedPosts.index + 20 : result.length - 1) })
    //                 .then(res => {
    //                     if (mostLikedPosts.index + 20 >= result.length) {
    //                         // setMostLikedPostsEnded(true);
    //                     }

    //                     let postsArray = res.data;
    //                     if(postsArray.length !== 0) {
    //                         setLoadedPosts(prev => {
    //                             let newObj = { ...prev };
    //                             let ids = Array.from(postsArray ? postsArray : []).map(e => e.id);
    //                             newObj.lastPostId = 99999999;
    //                             newObj.lastTimeRefreshed = new Date().getTime();
    //                             newObj.posts = [...newObj.posts, ...Array.from(postsArray ? postsArray : [])];
    //                             return newObj;
    //                         });
    //                     }
    //                 })
    //                 .then(() => setMostLikedPosts(prev => {
    //                     return {...prev, index: prev.index + 20};
    //                 }))
    //                 .then(() => setCanLoadPosts(false))
    //                 .catch(err => console.log(err));
    //             break;
    //     }
    // }

    // const resetLoadedPosts = () => {
    //     setMostLikedPosts({
    //         posts: [],
    //         index: 0
    //     });
    //     setLoadedPosts({
    //         lastTimeRefreshed: 0,
    //         lastPostId: 99999999,
    //         posts: [
    
    //         ]
    //     });
    //     // loadPosts("reset");
    // }

    const handlePostLoading = (e) => {
        e.preventDefault();
        if (window.innerHeight + document.documentElement.scrollTop >= document.scrollingElement.scrollHeight - loadPostsBottomMargin) {
            if (canLoad) {
                loadPostGateway.execute(
                    dispatch(loadPosts())
                )
            }
        }
    }

    useEffect(() => {
        dispatch(resetPosts());
        window.addEventListener("scroll", handlePostLoading);

        dispatch(loadPosts());

        return () => {
            window.removeEventListener("scroll", handlePostLoading);
            dispatch(resetPosts());
        }
    }, []);

    const postElements = posts.map(e => <Article key={e.id} id={e.id} postVisibleName={e.visible_name} utcDate={e.date} text={e.text} postUsername={e.username} images={e.images} profilePictureUrl={e.profilePictureUrl} username={username} grade={e.grade} isLogged={isLogged} likes={e.likes} isLiked={e.isLiked} />);

    return (
        <div className="Mainboard">
            <CreatePost isCreatePostOpen={isCreatePostOpen} setIsCreatePostOpen={setIsCreatePostOpen} newPostData={newPostData} setNewPostData={setNewPostData} newPostImages={newPostImages} setNewPostImages={setNewPostImages} />
            { username && <><img src={Cat} alt="cat" style={{ width: "100px" }} /><p style={{ textAlign: "center", width: "60%", color: "var(--gray)" }}>Thanks for using Bangerify! If you see any bugs / have any ideas you can send the message to ADMIN (can be found in credits tab)</p></> }

            {/* <select value={postOrder} onChange={(e) => setPostOrder(parseInt(e.target.value))}>
                <option value={0}>latest</option>
                <option value={1}>most liked</option>
            </select> */}
            
            { isLogged && <button className="Button1" onClick={() => setIsCreatePostOpen(true)}>ADD POST</button> }

            { posts.error && <p>{ posts.error }</p> }
            { postElements }<br />
        </div>
    );
}

export default Mainboard;