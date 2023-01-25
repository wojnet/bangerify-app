import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { axiosJWT } from "../Helpers";
import Logo from "../assets/bangerifyLogo.svg";
import LogoWhite from "../assets/bangerifyLogoWhite.svg";
import Sun from "../assets/Sun.svg";
import Moon from "../assets/Moon.svg";

const NavbarMobile = ({ isLogged, setIsLogged, updateIsLogged, path, setPath, username, theme, setTheme, updateTheme }) => {

    const location = useLocation();

    const [isOpen, setIsOpen] = useState(false);

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
                    {/* <Link to="/kupGemy" style={ path === "/kupGemy" ? selectedStyle : {} }>Kup gemy</Link>  */}
                    <img style={{ width: "25px", marginTop: "20px", cursor: "pointer" }} src={theme ? Moon : Sun} alt="Theme change button" onClick={() => {
                        setTheme(prev => !prev);
                        updateTheme();
                        document.cookie = `theme=${theme ? 1 : 0}`;
                    }} />
                </ul>
                <div className="NavbarMobile--Bottom">
                    { isLogged && <Link to="/options" style={ path === "/options" ? selectedStyle : {} }>Options</Link> }
                    { isLogged && <Link to="/" onClick={handleLogout} style={{ marginBottom: "20px" }}>Logout</Link> }
                    { isLogged && <p>Logged in as {username}</p> }
                    <p>© 2022 Bangerify. All rights reserved.</p>
                </div>
            </nav>
        </>
    );
}

export default NavbarMobile;