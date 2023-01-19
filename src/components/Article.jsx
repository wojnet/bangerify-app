import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { useState, useEffect } from "react";
import Heart from "./Heart";
import Comments from "./Comments";
import { axiosJWT } from "../Helpers";
import UserSample from "../assets/userSample.png"

const Article = ({ id, postVisibleName, utcDate, text, postUsername, profilePictureUrl, username }) => {

    const [areSettingsOpen, setAreSettingsOpen] = useState(false);
    
    const localDate = new Date(utcDate);
    const lines = text.split("\n");

    const [isEditingArticle, setIsEditingArticle] = useState(false);
    const [changedArticle, setChangedArticle] = useState("");

    useEffect(() => {
        if (isEditingArticle) {
            setChangedArticle(text);
        }
    }, [isEditingArticle]);

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
            .then(res => document.location.reload())
            .catch(err => console.error(err));
    }

    return (
        <article className="Article">
            {/* SETTINGS */}
            <button className="Article--OptionsButton" onClick={() => setAreSettingsOpen(prev => !prev)}>...</button>
            { areSettingsOpen && <section className="Article--Options">
                { postUsername === username && <button onClick={editPost}>EDIT POST</button> }
                { postUsername === username && <button onClick={deletePost} style={{ color: "red" }}>DELETE POST</button> }
            </section> }

            {/* POST */}
            <section style={{ display: "flex" }}>
                <Link to={`/profile/${postUsername}`}>
                    <img src={profilePictureUrl ? profilePictureUrl : UserSample} alt="Profile picture" className="Article--ProfilePicture" />
                </Link>
                <section>
                    <p>
                        <Link to={`/profile/${postUsername}`} className="Article--Link">{postVisibleName}</Link>
                        <span className="Article--Date">{localDate.toLocaleDateString() + " / " + localDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </p>
                    <p style={{ fontSize: "14px", marginBottom: "10px" }}>@{postUsername}</p>
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
                <Heart />
                <Comments />
            </section>
        </article>
    );
}

export default Article;