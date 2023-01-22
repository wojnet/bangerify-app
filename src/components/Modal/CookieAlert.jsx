import { useState } from "react";
import { createPortal } from "react-dom";
import Cookie from "../../assets/cookie.png"

const CookieAlert = ({ isModalOpen, setIsModalOpen, allowCookies }) => {

    const closeModal = () => {
        setIsModalOpen(false);
    }

    const handleClick = (e) => {
        setIsModalOpen(false);
    }

    const allow = () => {
        allowCookies();
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
                <img src={Cookie} alt="cookie" style={{ width: "110px", marginBottom: "15px" }} />
                <h3>Cookies confirmation</h3>
                <p style={{ color: "var(--gray)" }}>Bangerify uses cookies to store your preferences.</p>
                <section style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                    <button className="Button1" onClick={() => {
                        allow();
                        closeModal();
                    }}>Confirm</button>
                    <button className="Button1" onClick={closeModal}>Decline</button>
                </section>
            </div>
        </>
        ,
        document.querySelector("#portal")
    );
}

export default CookieAlert;