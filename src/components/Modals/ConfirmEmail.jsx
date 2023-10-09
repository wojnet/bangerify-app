import { useState } from "react";
import { createPortal } from "react-dom";
import Envelope from "../../assets/envelope.svg"

const ConfirmEmail = ({ isModalOpen, setIsModalOpen }) => {

    const closeModal = () => {
        setIsModalOpen(false);
    }

    const handleClick = (e) => {
        setIsModalOpen(false);
    }

    const modalStyle = {
        width: "480px",
        height: "300px",
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

    if (!isModalOpen) return null;

    return createPortal(
        <>
            <div className="ConfirmEmail--Overlay" onClick={handleClick} style={overlayStyle}></div>
            <div className="ConfirmEmail" style={modalStyle}>
                <button onClick={closeModal} style={closeButtonStyle}>x</button>
                <img src={Envelope} alt="envelope icon" style={{ width: "110px", marginBottom: "15px" }} />
                <h3>Email Confirmation</h3>
                <p style={{ color: "var(--gray)" }}>We have sent you email to confirm the validity of your email address. If you cannot see your mail, check spam folder.</p>
            </div>
        </>
        ,
        document.querySelector("#portal")
    );
}

export default ConfirmEmail;