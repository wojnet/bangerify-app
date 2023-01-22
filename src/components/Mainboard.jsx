import { useState, useEffect } from "react";
import axios from "axios";
import { axiosJWT } from "../Helpers";
import Article from "./Article";
import UpperBar from "./UpperBar";
import CreatePost from "./Modal/CreatePost";

const Mainboard = ({ isLogged, loadedPosts, setLoadedPosts, username, isCreatePostOpen, setIsCreatePostOpen }) => {

    const [tajneDane, setTajneDane] = useState();
    const [postData, setPostData] = useState({ 
        post: ""
    });
    const date = new Date();

    const getTajneDane = () => {
        axiosJWT.get(`${process.env.BACKEND_URL}/api/test`, {
            headers: { authorization: "Bearer " + localStorage.getItem("accessToken") }
        })
            .then(res => setTajneDane(res.data))
            .catch(err => console.error(err));
    }

    // 0. latest; 1. hottest; 2. most popular
    function loadPosts() {
        axios.post(`${process.env.BACKEND_URL}/api/getPosts`, { lastPostId: loadedPosts.lastPostId, order: 0 })
            .then(res => {
                let postsArray = res.data;

                setLoadedPosts(prev => {
                    let newObj = { ...prev };
                    let ids = Array.from(postsArray ? postsArray : []).map(e => e.id);
                    newObj.lastPostId = ids.at(-1);
                    newObj.lastTimeRefreshed = date.getTime();
                    newObj.posts = [...newObj.posts, ...Array.from(postsArray ? postsArray : [])];
                    return newObj;
                });
            })
            .catch(err => console.log(err));
    }

    useEffect(() => {
        loadPosts();
    }, []);

    const posts = loadedPosts.posts.map(e => <Article key={e.id} id={e.id} postVisibleName={e.visible_name} utcDate={e.date} text={e.text} postUsername={e.username} profilePictureUrl={e.profilePictureUrl} username={username} />);

    return (
        <div className="Mainboard">
            <CreatePost isCreatePostOpen={isCreatePostOpen} setIsCreatePostOpen={setIsCreatePostOpen} postData={postData} setPostData={setPostData}/>
            {/* <UpperBar /> */}
            <button onClick={() => {
                setLoadedPosts({
                    lastTimeRefreshed: 0,
                    lastPostId: 99999999,
                    posts: []
                });
                loadPosts();
            }}>Refresh</button>
            {  }
            { isLogged && <button onClick={() => setIsCreatePostOpen(true)}>ADD POST</button> }

            { posts }
            <h2 style={{ marginTop: 50, color: "var(--gray)" }}>LOADING POSTS...</h2>

            { /* <button onClick={getTajneDane}>Dostań tajne dane</button>
            { tajneDane ? tajneDane : "" } */ }
        </div>
    );
}

export default Mainboard;