import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import { axiosJWT } from "../../helpers/Helpers";
import ImagePreview from "../ImagePreview";
import { AWSUploadFiles } from "../../helpers/AWS";

const CreatePost = ({ isCreatePostOpen, setIsCreatePostOpen, postData, setPostData, postImages, setPostImages, resetLoadedPosts }) => {

    const closeModal = () => {
        setIsCreatePostOpen(false);
    }

    const handleClick = (e) => {
        setIsCreatePostOpen(false);
    }

    const createPost = async () => {
        // /api/s3Url

        if (postImages.length !== 0) {
            // POST WITH IMAGES

            // const AWSUpload = async (_images) => {
            //     const imageUrlArray = [];

            //     for (const image of _images) {
            //         const url = await axiosJWT.get(`${process.env.BACKEND_URL}/api/s3Url`).then(res => res.data.url).catch(err => console.error(err));

            //         await axios.put(url, image, {
            //             headers: {
            //                 "Content-Type": "multipart/form-data"
            //             }
            //         })
                    
            //         imageUrlArray.push(url.split("?")[0]);
            //     }

            //     return imageUrlArray;
            // }

            const imageUrlArray = await AWSUploadFiles(postImages);

            axiosJWT.post(`${process.env.BACKEND_URL}/api/createPost`, { postData: postData, images: [...imageUrlArray] })
                .then(res => {
                    setIsCreatePostOpen(false);
                    setPostData({ 
                        post: ""
                    });
                    setPostImages([]);
                })
                .then(() => resetLoadedPosts())
                .catch(err => console.log(err));

        } else {
            // SIMPLE POST WITHOUT IMAGES
            axiosJWT.post(`${process.env.BACKEND_URL}/api/createPost`, { postData: postData, images: [] })
                .then(res => {
                    setIsCreatePostOpen(false);
                    setPostData({ 
                        post: ""
                    });
                })
                .then(() => resetLoadedPosts())
                .catch(err => console.log(err));
        }
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

    const deleteInputImage = (_index) => {
        setPostImages(prev => [...prev].filter((e, i) => i !== _index));
    }

    const images = Array.from(postImages).map((e, i) => <ImagePreview key={i} id={i} imageElement={e} deleteInputImage={deleteInputImage} />);

    if (!isCreatePostOpen) return null;

    return createPortal(
        <>
            <div className="CreatePost--Overlay" onClick={handleClick} style={overlayStyle}></div>
            <div className="CreatePost" style={modalStyle}>
                <button onClick={closeModal} style={closeButtonStyle}>x</button>
                <h2>What's up?</h2>

                <textarea value={postData.post}
                    className="CreatePost--Textarea"
                    maxLength="1024"
                    onChange={(e) => setPostData(prev => {
                        return {...prev, post: e.target.value}
                    })}
                
                />

                <section style={{ display: "flex" }}>
                    <input className="ImageInput" type="file" id="ImageInput" accept="image/*" multiple={true} onChange={(e) => {
                        setPostImages(prev => {
                            return [...prev, ...e.target.files];
                        });
                    }} />
                    <label htmlFor="ImageInput">Upload Images</label>
                </section>

                <section className="ImagePreview--Wrapper">{ images }</section>

                <button onClick={createPost}>Create Post</button>
                <p style={{ textAlign: "center", fontSize: "10px", color: "var(--gray)", fontStyle: "italic" }}>* you can use markdown to format text</p>

            </div>
        </>
        ,
        document.querySelector("#portal")
    );
}

export default CreatePost;