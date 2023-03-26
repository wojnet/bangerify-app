import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { axiosJWT } from "../helpers/Helpers";
import Logo from "../assets/bangerifyLogo.svg";
import LogoWhite from "../assets/bangerifyLogoWhite.svg";
import handleLogout from "../helpers/Logout";

const NavbarMobile = ({ isLogged, setIsLogged, updateIsLogged, path, setPath, username, theme, setTheme, updateTheme }) => {

    const location = useLocation();

    const [isOpen, setIsOpen] = useState(false);

    const updatePathState = () => {
        setPath(location.pathname);
    }

    useEffect(updatePathState, []);

    useEffect(() => {
        setIsOpen(false);
        updatePathState();
        updateIsLogged();
    }, [location]);

    const selectedStyle = {
        background: "var(--black)",
        color: "var(--white)",
        boxShadow: "0 5px 10px #0003"
    }

    return (
        <>
            <div className="Burger" style={ isOpen ? { left: 200 } : { left: 0 }} onClick={() => setIsOpen(prev => !prev)}>
                <div style={ isOpen ? { transform: "translateY(10px) rotate(45deg)", width: "75%" } : {} }></div>
                <div style={ isOpen ? { width: 0 } : {} }></div>
                <div style={ isOpen ? { transform: "translateY(-10px) rotate(-45deg)", width: "75%" } : {} }></div>
            </div>

            <nav className="NavbarMobile" style={ isOpen ? { left: 0, boxShadow: "0 0 50px #0008" } : { left: -250 }}>
                <img src={theme ? LogoWhite : Logo} className="NavbarMobile--Logo" />
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
                        document.cookie = `theme=${theme ? 1 : 0}`;
                    }} /> */}

                </ul>
                <div className="NavbarMobile--Bottom">
                    <Link to="/credits" style={ path === "/credits" ? selectedStyle : {} }>Credits</Link>
                    { isLogged && <Link to="/" onClick={() => handleLogout(updateIsLogged)} style={{ marginBottom: "20px" }}>Logout</Link> }
                    { isLogged && <p>Logged in as {username}</p> }
                    <p>© 2022 Bangerify. All rights reserved.</p>
                </div>
            </nav>
        </>
    );
}

export default NavbarMobile;