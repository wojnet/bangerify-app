import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { axiosJWT } from "../Helpers";
import Logo from "../assets/bangerifyLogo.svg";
import LogoWhite from "../assets/bangerifyLogoWhite.svg";
import Sun from "../assets/Sun.svg";
import Moon from "../assets/Moon.svg";

const Navbar = ({ isLogged, setIsLogged, updateIsLogged, path, setPath, username, theme, setTheme, updateTheme }) => {

    const location = useLocation();

    const handleLogout = () => {
        axiosJWT.post(`${process.env.BACKEND_URL}/api/auth/logout`, { token: localStorage.getItem("refreshToken") }, {
            headers: { authorization: "Bearer " + localStorage.getItem("accessToken") }
        })
        .then(res => {
            localStorage.setItem("accessToken", "");
            localStorage.setItem("refreshToken", "");
            updateIsLogged();
        })
        .catch(err => console.log(err));
    }

    const updatePathState = () => {
        setPath(location.pathname);
    }

    useEffect(updatePathState, []);
    useEffect(() => {
        updatePathState();
        updateIsLogged();
    }, [location]);

    const selectedStyle = {
        background: "var(--black)",
        color: "var(--white)",
        boxShadow: "0 5px 10px #0003"
    }

    return (
        <nav className="Navbar">
            <img src={theme ? LogoWhite : Logo} className="Navbar--Logo" />
            <ul>
                <Link to="/" style={ path === "/" ? selectedStyle : {} } onClick={() => {
                    if (path === "/") {
                        window.location.reload();
                    }
                }}>Mainboard</Link>
                { isLogged && <a href={`/profile/${username}`} style={ path === "/profile/"+username ? selectedStyle : {} }>Profile</a> }
                { !isLogged && <Link to="/authenticate" style={ path === "/authenticate" ? selectedStyle : {} }>Login</Link> }

                {/* <img style={{ width: "25px", marginTop: "20px", cursor: "pointer" }} src={theme ? Moon : Sun} alt="Theme change button" onClick={() => {
                    setTheme(prev => !prev);
                    updateTheme();
                }} /> */}

            </ul>
            <div className="Navbar--Bottom">
                <Link to="/credits" style={ path === "/credits" ? selectedStyle : {} }>Credits</Link>
                { isLogged && <Link to="/" onClick={handleLogout} style={{ marginBottom: "20px" }}>Logout</Link> }
                { isLogged && <p>Logged in as {username}</p> }
                <p>© 2022 Bangerify. All rights reserved.</p>
            </div>
        </nav>
    );
}

export default Navbar;