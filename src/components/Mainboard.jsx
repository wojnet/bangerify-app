import { useState, useEffect } from "react";
import axios from "axios";
import { axiosJWT } from "../helpers/Helpers";
import Article from "./Article/Article";
import Semaphore from "../helpers/Semaphore";
// import UpperBar from "./UpperBar";
import CreatePost from "./Modals/CreatePost";
import Cat from "../assets/cat.png";

const Mainboard = ({ isLogged, loadedPosts, setLoadedPosts, username, isCreatePostOpen, setIsCreatePostOpen, imageWindowState, setImageWindowState, postOrder, setPostOrder, mostLikedPosts, setMostLikedPosts }) => {

    const [canLoadPosts, setCanLoadPosts] = useState(false);
    const [mostLikedPostsEnded, setMostLikedPostsEnded] = useState(false);
    const [postData, setPostData] = useState({ 
        post: ""
    });

    const semaphore = new Semaphore(2);
    const date = new Date();

    const [postImages, setPostImages] = useState([]);

    // 0. latest; 1. most liked
    const loadPosts = async (_reset) => {
        switch(postOrder) {
            case 0:
                await axios.post(`${process.env.BACKEND_URL}/api/getPosts`, { lastPostId: _reset === "reset" ? 99999999 : loadedPosts.lastPostId })
                    .then(res => {
                        let postsArray = res.data;
                        if(postsArray.length !== 0) {
                            setLoadedPosts(prev => {
                                let newObj = { ...prev };
                                let ids = Array.from(postsArray ? postsArray : []).map(e => e.id);
                                newObj.lastPostId = ids.at(-1);
                                newObj.lastTimeRefreshed = date.getTime();
                                newObj.posts = [...newObj.posts, ...Array.from(postsArray ? postsArray : [])];
                                return newObj;
                            });
                        }
                    })
                    .then(() => setCanLoadPosts(false))
                    .catch(err => console.log(err));
                break;
            case 1:
                // mostLikedPosts
                var result;
                
                if (postOrder === 1 && !mostLikedPosts.posts.length) {
                    result = await axios.get(`${process.env.BACKEND_URL}/api/getMostLikedPostsList`).then(res => res.data);
                    setMostLikedPosts(prev => {
                        return {...prev, posts: result};
                    });
                } else {
                    result = mostLikedPosts.posts;
                }

                await axios.post(`${process.env.BACKEND_URL}/api/getPostsById`, { list: result.slice(mostLikedPosts.index, mostLikedPosts.index + 20 < result.length ? mostLikedPosts.index + 20 : result.length - 1) })
                    .then(res => {
                        if (mostLikedPosts.index + 20 >= result.length) {
                            setMostLikedPostsEnded(true);
                        }

                        let postsArray = res.data;
                        if(postsArray.length !== 0) {
                            setLoadedPosts(prev => {
                                let newObj = { ...prev };
                                let ids = Array.from(postsArray ? postsArray : []).map(e => e.id);
                                newObj.lastPostId = 99999999;
                                newObj.lastTimeRefreshed = date.getTime();
                                newObj.posts = [...newObj.posts, ...Array.from(postsArray ? postsArray : [])];
                                return newObj;
                            });
                        }
                    })
                    .then(() => setMostLikedPosts(prev => {
                        return {...prev, index: prev.index + 20};
                    }))
                    .then(() => setCanLoadPosts(false))
                    .catch(err => console.log(err));
                break;
        }
    }

    const resetLoadedPosts = () => {
        setMostLikedPosts({
            posts: [],
            index: 0
        });
        setLoadedPosts({
            lastTimeRefreshed: 0,
            lastPostId: 99999999,
            posts: [
    
            ]
        });
        loadPosts("reset");
    }

    const handlePostLoading = () => {
        return function() {
            if (window.innerHeight + document.documentElement.scrollTop >= document.scrollingElement.scrollHeight - 100) {
                if (!mostLikedPostsEnded) {
                    setCanLoadPosts(true);
                }
            }
        }
    }

	useEffect(() => {
		resetLoadedPosts();
	}, [postOrder]);


    useEffect(() => {
        const scrollEventListener = window.addEventListener("scroll", (e) => {
            e.preventDefault();
            handlePostLoading()();
        });

        return () => {
            window.removeEventListener("scroll", scrollEventListener);
        }
    }, []);

    useEffect(() => {
        if(canLoadPosts) {
            loadPosts();
        }
    }, [canLoadPosts]);

    const posts = loadedPosts.posts.map(e => <Article key={e.id} id={e.id} postVisibleName={e.visible_name} utcDate={e.date} text={e.text} postUsername={e.username} images={e.images === null ? [] : JSON.parse(e.images)} profilePictureUrl={e.profilePictureUrl} username={username} grade={e.grade} setImageWindowState={setImageWindowState} isLogged={isLogged} />);

    return (
        <div className="Mainboard">
            <CreatePost isCreatePostOpen={isCreatePostOpen} setIsCreatePostOpen={setIsCreatePostOpen} postData={postData} setPostData={setPostData} postImages={postImages} setPostImages={setPostImages} resetLoadedPosts={resetLoadedPosts} />

            { username && <><img src={Cat} alt="cat" style={{ width: "100px" }} /><p style={{ textAlign: "center", width: "60%", color: "var(--gray)" }}>Thanks for using Bangerify! If you see any bugs / have any ideas you can send the message to ADMIN (can be found in credits tab)</p></> }

            <select value={postOrder} onChange={(e) => setPostOrder(parseInt(e.target.value))}>
                <option value={0}>latest</option>
                <option value={1}>most liked</option>
            </select>
            
            { isLogged && <button className="Button1" onClick={() => setIsCreatePostOpen(true)}>ADD POST</button> }
            { posts }<br />
        </div>
    );
}

export default Mainboard;