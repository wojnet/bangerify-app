import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useCookies } from "react-cookie";
import { setTheme } from "../../globalSlice";

const ChangeTheme = () => {
    const dispatch = useDispatch();

    const themeIcons = {
        light: "🔮",
        dark: "☀️"
    }

    const [cookies, setCookie] = useCookies(["theme"]);

    const theme = useSelector(state => state.global.theme);

    const handleChangeTheme = () => {
        dispatch(setTheme(theme === "light" ? "dark" : "light"));
        setCookie("theme", cookies.theme === "light" ? "dark" : "light");
    }

    return (
        <button title="Change theme" className="ChangeTheme--Button" onClick={handleChangeTheme} >
            { themeIcons[theme] || "🌻" }
        </button>
    );
}

export default ChangeTheme;