import { useState } from "react";
import { createPortal } from "react-dom";
import { axiosJWT } from "../../Helpers";
import Envelope from "../../assets/envelope.svg"

const CreatePost = ({ isCreatePostOpen, setIsCreatePostOpen, postData, setPostData }) => {

    const closeModal = () => {
        setIsCreatePostOpen(false);
    }

    const handleClick = (e) => {
        setIsCreatePostOpen(false);
    }

    const createPost = () => {
        axiosJWT.post(`${process.env.BACKEND_URL}/api/createPost`, { postData: postData })
            .then(res => {
                setIsCreatePostOpen(false);
                setPostData({ 
                    post: ""
                });
            })
            .then(() => document.location.reload())
            .catch(err => console.log(err));
    }

    const modalStyle = {
        width: "90%",
        height: "auto",
        maxWidth: "680px",
        maxHeight: "90%",
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        background: "var(--white)",
        boxShadow: "0 10px 20px #0002",
        borderRadius: "20px",
        fontSize: "14px",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: "10px",
        alignItems: "center",
        padding: "50px 50px",
        zIndex: 1000
    }

    const overlayStyle = {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "#0005",
        zIndex: 1000
    }

    const closeButtonStyle = {
        width: "20px",
        height: "20px",
        position: "fixed",
        border: "none",
        background: "none",
        fontSize: "22px",
        top: "10px",
        right: "15px",
        cursor: "pointer"
    }

    if (!isCreatePostOpen) return null;

    return createPortal(
        <>
            <div className="CreatePost--Overlay" onClick={handleClick} style={overlayStyle}></div>
            <div className="CreatePost" style={modalStyle}>
                <button onClick={closeModal} style={closeButtonStyle}>x</button>
                <h2>What's up?</h2>
                <textarea value={postData.post}
                    maxLength="1024"
                    onChange={(e) => setPostData(prev => {
                        return {...prev, post: e.target.value}
                    })}
                
                />
                <section style={{ display: "flex" }}>
                    <button>🖼️</button>
                </section>
                <button onClick={createPost}>Create Post</button>
            </div>
        </>
        ,
        document.querySelector("#portal")
    );
}

export default CreatePost;