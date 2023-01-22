import { Link } from "react-router-dom";
import { useState } from "react";
import { axiosJWT } from "../Helpers";

const Comment = ({ id, userId, text, date, profilePictureUrl, commentUsername, visibleName, username, loadComments }) => {

    const [areSettingsOpen, setAreSettingsOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const formatedDate = new Date(date);

    const editComment = () => [

    ]

    const deleteComment = () => {
        axiosJWT.post(`${process.env.BACKEND_URL}/api/deleteComment`, { commentId: id })
            .then(() => {
                console.log(1);
                loadComments();
            })
            .catch(err => console.error(err));
    }

    return (
        <div className="Comment">
            <section className="Comment--Header">
                <Link to={`/profile/${commentUsername}`} style={{ textDecoration: "none", color: "var(--black)" }}>
                    <section style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <img src={profilePictureUrl} alt="Profile picture" />
                        <p>@{commentUsername}<span>{formatedDate.toLocaleDateString()} / {formatedDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span></p>
                    </section>
                </Link>

                <button className="Comment--OptionsButton" onClick={() => setAreSettingsOpen(prev => !prev)} style={{ color: "var(--black)" }}>...</button>
                { areSettingsOpen && <section className="Article--Options">
                    { commentUsername === username && <button style={{ color: "var(--black)" }} onClick={editComment}>EDIT COMMENT</button> }
                    { commentUsername === username && <button style={{ color: "red" }} onClick={deleteComment}>DELETE COMMENT</button> }
                </section> }

            </section>
            <p style={{ marginTop: "5px" }}>{text}</p>
        </div>
    );
}

export default Comment;