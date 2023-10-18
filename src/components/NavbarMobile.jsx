import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleDebugWindow } from "../settings/globalSettingsSlice";
import { setPath } from "../globalSlice";
import Logo from "../assets/bangerifyLogo.svg";
import LogoWhite from "../assets/bangerifyLogoWhite.svg";
import handleLogout from "../helpers/Logout";

const NavbarMobile = ({ updateIsLogged }) => {
    const location = useLocation();
    const dispatch = useDispatch();

    const isLogged = useSelector((state) => state.global.isLogged);
    const theme = useSelector((state) => state.global.theme);
    const username = useSelector((state) => state.global.username);
    const path = useSelector(state => state.global.path);

    const [isOpen, setIsOpen] = useState(false); // IS MOBILE NAVBAR OPEN

    const updatePathState = () => {
        dispatch(setPath(location.pathname));
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
                <img src={theme === "light" ? Logo : LogoWhite} className="NavbarMobile--Logo" alt="Bangerify logo" />
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
                    <p style={{ userSelect: "none", cursor: "pointer" }} onClick={() => dispatch(toggleDebugWindow())}>© 2023 Bangerify. All rights reserved.</p>
                </div>
            </nav>
        </>
    );
}

export default NavbarMobile;