import { Link } from "react-router-dom";
import { useState } from "react";
import { axiosJWT } from "../helpers/Helpers";
import OptionsList from "./OptionsList";

const Comment = ({ id, userId, text, date, profilePictureUrl, commentUsername, visibleName, username, loadComments, grade }) => {

    const [areSettingsOpen, setAreSettingsOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const formatedDate = new Date(date);

    const editComment = () => {
        setAreSettingsOpen(false);
        alert("Comment editing in development");
    }

    const deleteComment = () => {
        axiosJWT.post(`${process.env.BACKEND_URL}/api/deleteComment`, { commentId: id })
            .then(() => {
                console.log(1);
                loadComments();
            })
            .catch(err => console.error(err));
    }

    const visibleNameStyles = {
        0: {},
        1: { color: "var(--gradeMod)" }, // MOD
        2: { color: "var(--gradeAdmin)" }, // ADMIN
        3: { color: "var(--gradeHeadAdmin)" }, // HEADADMIN
        4: { color: "var(--gradeCreator)" }, // CREATOR
        348: { color: "var(--gradeGigachad)" } // GIGACHAD
    }

    return (
        <div className="Comment">
            <section className="Comment--Header">
                <Link className="Comment--TopLine" to={`/profile/${commentUsername}`}>
                    <section style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <img src={profilePictureUrl} alt="Profile picture" />
                        <p style={visibleNameStyles[grade]}>{visibleName}<span>{formatedDate.toLocaleDateString()} / {formatedDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span></p>
                    </section>
                </Link>

                <OptionsList areSettingsOpen={areSettingsOpen} setAreSettingsOpen={setAreSettingsOpen} postUsername={commentUsername} username={username} functions={[{
                    text: "Edit Comment",
                    callback: editComment,
                    auth: "author"
                }, {
                    text: "Delete Comment",
                    callback: deleteComment,
                    auth: "author"
                }, {
                    text: "???",
                    callback: () => { window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank") },
                    auth: "notAuthor"
                }]} />

            </section>
            <p style={{ marginTop: "5px" }}>{text}</p>
        </div>
    );
}

export default Comment;