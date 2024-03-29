import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { useState, useEffect } from "react";
import axios from "axios";
import { axiosJWT } from "../../helpers/Helpers";
import ArticleHeartIcon from "./ArticleHeartIcon";
import CommentsIcon from "./CommentsIcon";
import UserSample from "../../assets/userSample.png"
import Comment from "./Comment";
import OptionsList from "./OptionsList";
import ImageGrid from "../../components/ImageGrid";

const Article = ({ id, postVisibleName, utcDate, text, postUsername, images, profilePictureUrl, username, grade, isLogged, likes, isLiked, addedLikes, setAddedLikes }) => {
    const [areSettingsOpen, setAreSettingsOpen] = useState(false);
    
    const localDate = new Date(utcDate);

    const [isEditingArticle, setIsEditingArticle] = useState(false);
    const [changedArticle, setChangedArticle] = useState("");

    // FAKE LIKES LMAO
    const [hasChangedLikes, setHasChangedLikes] = useState(false);

    const [isCommentInputOpen, setIsCommentInputOpen] = useState(false);
    const [commentValue, setCommentValue] = useState("");
    const [commentsData, setCommentsData] = useState([]);

    const loadComments = () => {
        axios.post(`${process.env.BACKEND_URL}/api/loadComments`, { postId: id })
            .then(res => {
                setCommentsData(res.data.comments);
            })
            .catch(err => console.error(err));
    }

    const loadPostData = async () => {
        //load likes and comments
        // loadLikes();
        loadComments();
    }

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

    const like = () => {
        if (isLogged) {
            setHasChangedLikes(prev => !prev);

            //? USTAWIENIE LICZBY LAJKÓW W BAZIE DANYCH
            axiosJWT.post(`${process.env.BACKEND_URL}/api/setLike`, { postId: id })
                .catch(err=> console.error(err));
        } else {

            //! JEŻELI NIEZALOGOWANO
            alert("You need to be logged in");
        }
	}

    const sendComment = () => {
        if (commentValue !== "") {
            axiosJWT.post(`${process.env.BACKEND_URL}/api/commentPost`, { postId: id, text: commentValue })
            .then((res) => {
                setIsCommentInputOpen(false);
                setCommentValue("");
                if (res.data === "adding comments blocked") {
                    alert("author blocked adding comments to this post");
                }
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

    const LinkRenderer = (props) => {
        return <a href={props.href} target="_blank">{props.children}</a>;
    }

    useEffect(() => {
        if (isEditingArticle) {
            setChangedArticle(text);
        }
    }, [isEditingArticle]);

    useEffect(() => {
        if (hasChangedLikes) {
            if (isLiked) {
                setAddedLikes(id, -1);
            } else {
                setAddedLikes(id, 1);
            }
        } else {
            setAddedLikes(id, 0);
        }
    }, [hasChangedLikes]);

    useEffect(() => {
        loadPostData();
    }, [username]); //! BIG CHANGE

    var comments = commentsData.map((e, i) => <Comment key={i} id={e.id} userId={e.userId} text={e.text} date={e.date} profilePictureUrl={e.profilePictureUrl} commentUsername={e.username} visibleName={e.visible_name} username={username} loadComments={loadComments} grade={e.grade} />);

    return (
        <article className="Article">

            <OptionsList areSettingsOpen={areSettingsOpen} setAreSettingsOpen={setAreSettingsOpen} postUsername={postUsername} username={username} functions={[{
                text: "Edit Post",
                callback: editPost,
                auth: "author"
            }, {
                text: "Delete Post",
                callback: deletePost,
                auth: "author"
            }]} />

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

            { !isEditingArticle && <ReactMarkdown
                className="Article--Content"
                linkTarget="_blank"
                >
                    { text.replaceAll("\n", "  \n").replace(/@\w+/g, e => `[${e}](/profile/${e.replace("@", "")})`) }
            </ReactMarkdown> }

            { [...JSON.parse(images)].length !== 0 && !isEditingArticle && <ImageGrid images={images}/> }

            { isEditingArticle && <>
                <textarea className="Article--TextArea" value={changedArticle} onChange={(e) => setChangedArticle(e.target.value)} />
                <button className="Button1" onClick={savePost}>SAVE</button>
                <button className="Button1" onClick={() => setIsEditingArticle(false)}>Close editing</button>
            </> }


            <section className="Article--Numbers">
                <ArticleHeartIcon number={likes} addedLikes={addedLikes} click={like} isLiked={isLiked} hasChangedLikes={hasChangedLikes} />
                <CommentsIcon number={commentsData.length} click={() => setIsCommentInputOpen(true)} />
            </section>

            { (isCommentInputOpen && username !== "") && <section style={{ width: "100%", display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "10px" }}>
                <textarea style={{ width: "100%", flexGrow: 1, resize: "vertical", border: "1px solid var(--gray)", background: "var(--hoverGray05)", padding: "2px" }} value={commentValue} onChange={(e) => setCommentValue(e.target.value)} />
                <button className="Button1" onClick={sendComment}>COMMENT</button>
                <button style={{ width: "20px", height: "20px", background: "none", border: "none", color: "var(--black)", fontSize: "16px", cursor: "pointer" }} onClick={() => setIsCommentInputOpen(false)}>&times;</button>
            </section> }

            { comments }
            {/* { commentsData.map((e, i) => <ArticleHeartIcon />) } */}

        </article>
    );
}

export default Article;