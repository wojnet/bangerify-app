import { useState } from "react";
import { createPortal } from "react-dom";

const ImageWindow = ({ imageWindowState, setImageWindowState }) => {

    const closeModal = () => {
        setImageWindowState(prev => {
            return {
                ...prev,
                isOpen: false
            }
        });
    }

    const handleClick = (e) => {
        setImageWindowState(prev => {
            return {
                ...prev,
                isOpen: false
            }
        });
    }

    const changeIndex = (amount) => {
        setImageWindowState(prev => {
            prev.index;
            return {
                ...prev,
                index: prev.index + amount
            }
        });
    }

    const modalStyle = {
        minWidth: "50px",
        minHeight: "50px",
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
        padding: "10px 50px",
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

    const imageStyle = {
        height: "50vh",
        borderRadius: "10px",
	    boxShadow: "0 0 10px #0001"
    }

    if (!imageWindowState.isOpen) return null;

    return createPortal(
        <>
            <div onClick={handleClick} style={overlayStyle}></div>
            <div style={modalStyle}>
                <button onClick={closeModal} style={closeButtonStyle}>x</button>
                <img style={imageStyle} src={imageWindowState.images[imageWindowState.index]} alt={imageWindowState.url} />
                <section style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                    <button className="Button1" onClick={() => changeIndex(-1)}>LEFT</button>
                    <button className="Button1" onClick={() => changeIndex(1)}>RIGHT</button>
                </section>
            </div>
        </>
        ,
        document.querySelector("#portal")
    );
}

export default ImageWindow;