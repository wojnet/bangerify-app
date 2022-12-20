import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../assets/logo.png"

const Navbar = () => {

    const [path, setPath] = useState();
    const location = useLocation();

    const updatePathState = () => {
        setPath(location.pathname);
    }

    useEffect(updatePathState, []);
    useEffect(updatePathState, [location]);

    const selectedStyle = {
        background: "var(--black)",
        color: "var(--white)"
    }

    return (
        <nav className="Navbar">
            <img src={Logo} />
            <ul>
                <Link to="/" style={ path === "/" ? selectedStyle : {} }>Mainboard</Link>
                {/* <Link to="/explore" style={ path === "/explore" ? selectedStyle : {} }>Explore</Link> */}
                {/* <Link to="/friends" style={ path === "/friends" ? selectedStyle : {} }>Friends</Link> */}
                <Link to="/profile" style={ path === "/profile" ? selectedStyle : {} }>Profile</Link>
            </ul>
            <div className="Navbar--Bottom">
                <Link to="/options" style={ path === "/options" ? selectedStyle : {} }>Options</Link>
                <p>© 2022 Bangerify. All rights reserved.</p>
            </div>
        </nav>
    );
}

export default Navbar;