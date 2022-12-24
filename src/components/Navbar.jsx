import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { axiosJWT } from "../Helpers";
import Logo from "../assets/logo.png"

const Navbar = ({ isLogged, setIsLogged, updateIsLogged }) => {

    const [path, setPath] = useState();
    const location = useLocation();

    const handleLogout = () => {
        axiosJWT.post("http://192.168.1.100:5000/api/auth/logout", { token: localStorage.getItem("refreshToken") }, {
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
        color: "var(--white)"
    }

    return (
        <nav className="Navbar">
            <img src={Logo} />
            <ul>
                <Link to="/" style={ path === "/" ? selectedStyle : {} }>Mainboard</Link>
                { isLogged && <Link to="/profile" style={ path === "/profile" ? selectedStyle : {} }>Profile</Link> }
                { !isLogged && <Link to="/authenticate" style={ path === "/authenticate" ? selectedStyle : {} }>Login</Link> }
            </ul>
            <div className="Navbar--Bottom">
                { isLogged && <Link to="/options" style={ path === "/options" ? selectedStyle : {} }>Options</Link> }
                { isLogged && <Link to="/" onClick={handleLogout}>Logout</Link> }
                <p>© 2022 Bangerify. All rights reserved.</p>
            </div>
        </nav>
    );
}

export default Navbar;