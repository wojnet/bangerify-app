import { useState, useEffect } from "react";
import axios from "axios";
import { axiosJWT } from "../Helpers";
import Article from "./Article";
// import UpperBar from "./UpperBar";
import CreatePost from "./Modal/CreatePost";

const Mainboard = ({ isLogged, loadedPosts, setLoadedPosts, username, isCreatePostOpen, setIsCreatePostOpen }) => {

    const [order, setOrder] = useState(0);
    const [canLoadPosts, setCanLoadPosts] = useState(false);
    const [postData, setPostData] = useState({ 
        post: ""
    });
    const date = new Date();

    const resetLoadedPosts = () => {
        setLoadedPosts({
            lastTimeRefreshed: 0,
            lastPostId: 99999999,
            posts: [
    
            ]
        });
    }

    // 0. latest; 1. most liked
    const loadPosts = () => {
        switch(order) {
            case 0:
                axios.post(`${process.env.BACKEND_URL}/api/getPosts`, { lastPostId: loadedPosts.lastPostId })
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
                        setCanLoadPosts(false);
                    })
                    .catch(err => console.log(err));
                break;
            case 1:
                axios.post(`${process.env.BACKEND_URL}/api/getPostsMostLiked`, { lastPostId: loadedPosts.lastPostId })
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
                        setCanLoadPosts(false);
                    })
                    .catch(err => console.log(err));
                break;
        }
    }

    useEffect(() => {
        resetLoadedPosts();
        loadPosts();

        const scrollEventListener = window.addEventListener("scroll", (e) => {
            e.preventDefault();
            if (window.innerHeight + document.documentElement.scrollTop >= document.scrollingElement.scrollHeight - 100) {
                setCanLoadPosts(true);
            }
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

    const posts = loadedPosts.posts.map(e => <Article key={e.id} id={e.id} postVisibleName={e.visible_name} utcDate={e.date} text={e.text} postUsername={e.username} profilePictureUrl={e.profilePictureUrl} username={username} grade={e.grade} />);

    return (
        <div className="Mainboard">
            <CreatePost isCreatePostOpen={isCreatePostOpen} setIsCreatePostOpen={setIsCreatePostOpen} postData={postData} setPostData={setPostData}/>
            {/* <UpperBar setOrder={setOrder} /> */}
            { isLogged && <button className="Button1" onClick={() => setIsCreatePostOpen(true)}>ADD POST</button> }
            { posts }<br />
        </div>
    );
}

export default Mainboard;