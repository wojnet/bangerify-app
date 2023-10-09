import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleDebugWindow } from "../settings/globalSettingsSlice";
import DebugWindow from "../features/debugWindow/DebugWindow";
import Logo from "../assets/bangerifyLogo.svg";
import LogoWhite from "../assets/bangerifyLogoWhite.svg";
import handleLogout from "../helpers/Logout";

const Navbar = ({ isLogged, setIsLogged, updateIsLogged, path, setPath, username, theme, setTheme, updateTheme }) => {

    const location = useLocation();
    const dispatch = useDispatch();
    const isDebugWindowOpen = useSelector((state) => state.globalSettings.isDebugWindowOpen);

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
            <img src={theme ? LogoWhite : Logo} className="Navbar--Logo" alt="Bangerify logo" />
            <ul>
                <Link to="/" style={ path === "/" ? selectedStyle : {} }>Mainboard</Link>
                { isLogged && <a href={`/profile/${username}`} style={ path === "/profile/"+username ? selectedStyle : {} }>Profile</a> }
                { !isLogged && <Link to="/authenticate" style={ path === "/authenticate" ? selectedStyle : {} }>Login</Link> }

            </ul>
            { isDebugWindowOpen && <DebugWindow /> }
            <div className="Navbar--Bottom">
                <Link to="/credits" style={ path === "/credits" ? selectedStyle : {} }>Credits</Link>
                { isLogged && <Link to="/" onClick={() => handleLogout(updateIsLogged)} style={{ marginBottom: "20px" }}>Logout</Link> }
                { isLogged && <p>Logged in as {username}</p> }
                <p style={{ userSelect: "none", cursor: "pointer" }} onClick={() => dispatch(toggleDebugWindow())}>© 2023 Bangerify. All rights reserved.</p>
            </div>
        </nav>
    );
}

export default Navbar;