import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { useState, useEffect } from "react";
import axios from "axios";
import { axiosJWT } from "../Helpers";
import HeartIcon from "./HeartIcon";
import CommentsIcon from "./CommentsIcon";
import UserSample from "../assets/userSample.png"
import Comment from "./Comment";

const Article = ({ id, postVisibleName, utcDate, text, postUsername, profilePictureUrl, username, isMobile, grade }) => {

    const [areSettingsOpen, setAreSettingsOpen] = useState(false);
    
    const localDate = new Date(utcDate);
    const lines = text.split("\n");

    const [isEditingArticle, setIsEditingArticle] = useState(false);
    const [changedArticle, setChangedArticle] = useState("");
    const [likes, setLikes] = useState(0);
    const [addedLikes, setAddedLikes] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [canLike, setCanLike] = useState(false);

    const [isCommentInputOpen, setIsCommentInputOpen] = useState(false);
    const [commentValue, setCommentValue] = useState("");
    const [commentsData, setCommentsData] = useState([]);

    const loadLikes = () => {

        if (username !== "") {
            axiosJWT.post(`${process.env.BACKEND_URL}/api/loadLikesAuth`, { postId: id })
                .then(res => {
                    setLikes(res.data.likes);
                    setIsLiked(res.data.liked === 0 ? false : true);
                })
                .catch(err => console.error(err));
        } else {
            axios.post(`${process.env.BACKEND_URL}/api/loadLikes`, { postId: id })
            .then(res => {
                setLikes(res.data.likes);
            })
            .catch(err => console.error(err));
        }

        
    }

    const loadComments = () => {
        axios.post(`${process.env.BACKEND_URL}/api/loadComments`, { postId: id })
            .then(res => {
                setCommentsData(res.data.comments);
            })
            .catch(err => console.error(err));
    }

    const loadPostData = () => {
        //load likes and comments
        loadLikes();
        loadComments();
    }

    useEffect(() => {
        if (isEditingArticle) {
            setChangedArticle(text);
        }
    }, [isEditingArticle]);

    useEffect(() => {
        loadPostData();
    }, []);

    const editPost = () => {
        setIsEditingArticle(true);
        setAreSettingsOpen(false);
    }

    const savePost = () => {
        axiosJWT.post(`${process.env.BACKEND_URL}/api/savePost`, { postId: id, text: changedArticle })
            .then(res => document.location.reload())
            .catch(err => console.error(err));
    }

    const deletePost = () => {
        axiosJWT.post(`${process.env.BACKEND_URL}/api/deletePost`, { postId: id })
            .then(res => window.reload())
            .catch(err => console.error(err));
    }

    const like = () => {
        if (username !== "") {
            if(!isLiked) {
                setIsLiked(true);
                setAddedLikes(prev => prev + 1);
            } else {
                setIsLiked(false);
                setAddedLikes(prev => prev - 1);
            }
    
            axiosJWT.post(`${process.env.BACKEND_URL}/api/setLike`, { postId: id })
                .catch(err=> console.error(err));
        } else {
            alert("You need to be logged in");
        }
	}

    const sendComment = () => {
        if (commentValue !== "") {
            axiosJWT.post(`${process.env.BACKEND_URL}/api/commentPost`, { postId: id, text: commentValue })
            .then(() => {
                setIsCommentInputOpen(false);
                setCommentValue("");
            })
            .then(() => loadComments())
            .catch(err => console.error(err));
        } else {
            setIsCommentInputOpen(false);
        }
    }

    const visibleNameStyles = {
        0: {},
        1: { color: "var(--gradeMod)" }, // MOD
        2: { color: "var(--gradeAdmin)" }, // ADMIN
        3: { color: "var(--gradeHeadAdmin)" }, // HEADADMIN
        4: { color: "var(--gradeCreator)" }, // CREATOR
        348: { color: "var(--gradeGigachad)" } // GIGACHAD
    }

    var comments = commentsData.map((e, i) => <Comment key={i} id={e.id} userId={e.userId} text={e.text} date={e.date} profilePictureUrl={e.profilePictureUrl} commentUsername={e.username} visibleName={e.visible_name} username={username} loadComments={loadComments} grade={e.grade} />);

    return (
        <article className="Article">
            {/* SETTINGS */}
            <button className="Article--OptionsButton" onClick={() => setAreSettingsOpen(prev => !prev)} style={{ color: "var(--black)" }}>...</button>
            { areSettingsOpen && <section className="Article--Options">
                { postUsername === username && <button onClick={editPost} style={{ color: "var(--black)" }}>EDIT POST</button> }
                { postUsername === username && <button onClick={deletePost} style={{ color: "red" }}>DELETE POST</button> }
            </section> }

            {/* POST */}
            <section style={{ display: "flex" }}>
                <Link to={`/profile/${postUsername}`}>
                    <img src={profilePictureUrl ? profilePictureUrl : UserSample} alt="Profile picture" className="Article--ProfilePicture" />
                </Link>
                <section>
                    <p className="Article--TopLine">
                        <Link to={`/profile/${postUsername}`} className="Article--Link" style={visibleNameStyles[grade]}>{postVisibleName}</Link>
                        <span className="Article--Date">{localDate.toLocaleDateString() + " / " + localDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </p>
                    <p style={{ fontSize: "14px", color: "var(--black)" }}>@{postUsername}</p>
                    <p className="Article--DateMobile">{localDate.toLocaleDateString() + " / " + localDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                </section>
            </section>

            {/* ARTICLE */}
            { !isEditingArticle && <ReactMarkdown className="Article--Content">
                { text.replaceAll("\n", "  \n") }
            </ReactMarkdown> }
            { isEditingArticle && <>
                <textarea style={{ width: "90%", height: "100px" }} value={changedArticle} onChange={(e) => setChangedArticle(e.target.value)} />
                <button onClick={savePost}>SAVE</button>
                <button onClick={() => setIsEditingArticle(false)}>Close editing</button>
            </> }


            <section style={{ display: "flex", gap: "10px" }}>
                <HeartIcon number={likes + addedLikes} click={like} isLiked={isLiked} />
                <CommentsIcon number={commentsData.length} click={() => setIsCommentInputOpen(true)} />
            </section>

            { (isCommentInputOpen && username !== "") && <section style={{ width: "100%", display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "10px" }}>
                <textarea style={{ width: "100%", flexGrow: 1, resize: "vertical", border: "1px solid var(--gray)", background: "var(--hoverGray05)", padding: "2px" }} value={commentValue} onChange={(e) => setCommentValue(e.target.value)} />
                <button className="Button1" onClick={sendComment}>COMMENT</button>
                <button style={{ width: "20px", height: "20px", background: "none", border: "none", color: "var(--black)", fontSize: "16px", cursor: "pointer" }} onClick={() => setIsCommentInputOpen(false)}>&times;</button>
            </section> }

            { comments }
            {/* { commentsData.map((e, i) => <HeartIcon />) } */}

        </article>
    );
}

export default Article;