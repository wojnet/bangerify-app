import { useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ResendEmail = ({ isModalOpen, setIsModalOpen }) => {

    const navigate = useNavigate();

    const closeModal = () => {
        setIsModalOpen(false);
    }

    const handleClick = (e) => {
        setIsModalOpen(false);
    }
    
    const [email, setEmail] = useState("");

    const resendEmail = () => {
        axios.post(`${process.env.BACKEND_URL}/api/confirmation/resendVerificationToken`, { email: email })
            .then(() => navigate("/"))
            .catch(err => console.error(err));
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
            <div onClick={handleClick} style={overlayStyle}></div>
            <div style={modalStyle}>
                <button onClick={closeModal} style={closeButtonStyle}>x</button>
                <h3>YOUR EMAIL IS NOT CONFIRMED</h3>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <button onClick={resendEmail}>RESEND EMAIL</button>
            </div>
        </>
        ,
        document.querySelector("#portal")
    );
}

export default ResendEmail;