import { createPortal } from "react-dom";
import { axiosJWT } from "../../../helpers/Helpers";
import ImagePreview from "./ImagePreview";
import { AWSUploadFiles } from "../../../helpers/AWS";
import { loadPosts, resetPosts } from "../../posts/postsSlice";
import { useDispatch } from "react-redux";

const CreatePost = ({ isCreatePostOpen, setIsCreatePostOpen, newPostData, setNewPostData, newPostImages, setNewPostImages }) => {
    const dispatch = useDispatch();
    const closeModal = () => setIsCreatePostOpen(false);
    
    const handleClick = (e) => setIsCreatePostOpen(false);

    const createPost = async () => {
        if (newPostImages.length !== 0) {
            const imageUrlArray = await AWSUploadFiles(newPostImages);

            axiosJWT.post(`${process.env.BACKEND_URL}/api/createPost`, { newPostData: newPostData, images: [...imageUrlArray] })
                .then(res => {
                    setIsCreatePostOpen(false);
                    setNewPostData({ 
                        post: ""
                    });
                    setNewPostImages([]);
                })
                .then(() => {
                    dispatch(resetPosts());
                    dispatch(loadPosts());
                })
                .catch(err => console.log(err));

        } else {
            // SIMPLE POST WITHOUT IMAGES
            axiosJWT.post(`${process.env.BACKEND_URL}/api/createPost`, { newPostData: newPostData, images: [] })
                .then(res => {
                    setIsCreatePostOpen(false);
                    setNewPostData({ 
                        post: ""
                    });
                })
                .then(() => {
                    dispatch(resetPosts());
                    dispatch(loadPosts());
                })
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
        setNewPostImages(prev => [...prev].filter((e, i) => i !== _index));
    }

    const images = Array.from(newPostImages).map((e, i) => <ImagePreview key={i} id={i} imageElement={e} deleteInputImage={deleteInputImage} />);

    if (!isCreatePostOpen) return null;

    return createPortal(
        <>
            <div className="CreatePost--Overlay" onClick={handleClick} style={overlayStyle}></div>
            <div className="CreatePost" style={modalStyle}>
                <button onClick={closeModal} style={closeButtonStyle}>x</button>
                <h2>What's up?</h2>

                <textarea value={newPostData.post}
                    className="CreatePost--Textarea"
                    maxLength="1024"
                    onChange={(e) => setNewPostData(prev => {
                        return {...prev, post: e.target.value}
                    })}
                
                />

                <section style={{ display: "flex" }}>
                    <input className="ImageInput" type="file" id="ImageInput" accept="image/*" multiple={true} onChange={(e) => {
                        setNewPostImages(prev => {
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