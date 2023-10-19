// PACKAGE IMPORTS
import { useState, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import jwtDecode from "jwt-decode";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { refreshToken, axiosJWT } from "./helpers/Helpers";
import { Helmet } from "react-helmet";
import DebugWindow from "./features/debugWindow/DebugWindow";
import updateIsLogged from "./helpers/updateIsLogged";

// ACTION IMPORTS
import { setIsLogged, setUsername, setIsMobile, setTheme } from "./globalSlice";
import { addDebugLine } from "./features/debugWindow/debugWindowSlice";

// COMPONENT IMPORTS
import Navbar from "./components/Navbar/Navbar";
import NavbarMobile from "./components/Navbar/NavbarMobile";
import Wrapper from "./components/Wrapper";
import RightPanel from "./components/RightPanel"
import CookieAlert from "./features/modals/cookieAlert/CookieAlert";
import ImageWindow from "./features/modals/imageWindow/ImageWindow";

import { useCookies } from "react-cookie";

export const App = () => {
	const dispatch = useDispatch();

	const isMobile = useSelector(state => state.global.isMobile);
	const navbarThreshold = useSelector(state => state.global.navbarThreshold);
	const isLogged = useSelector(state => state.global.isLogged)

	// MODALS
	const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
	const [isCookiesModalOpen, setIsCookiesModalOpen] = useState(false);
	const isDebugWindowOpen = useSelector((state) => state.globalSettings.isDebugWindowOpen);

	const [cookies, setCookie] = useCookies(["theme"]);

	// date.getTime(); ms since 1970
	
	const updateIsLogged = () => {
		dispatch(addDebugLine({ name: "- updateIsLogged()" }));
		if (localStorage.getItem("accessToken") && !isLogged) {
			axios.get(`${process.env.BACKEND_URL}/api/auth/isLogged`, {
				headers: { authorization: "Bearer " + localStorage.getItem("accessToken") }
			})
			.then(res => {
				dispatch(setIsLogged(res.data.isLogged));
				dispatch(setUsername(res.data.username));
				dispatch(addDebugLine({ name: `Logged in as ${res.data.username}` }));
			})
			
		} else if (!localStorage.getItem("accessToken") && isLogged) {
			localStorage.setItem("accessToken", "");
			localStorage.setItem("refreshToken", "");
			dispatch(setIsLogged(false));
			dispatch(setUsername(""));
			dispatch(addDebugLine({ name: "Logged out" }));
		}	
	}

	const checkIfCookiesAllowed = () => {
		let i = document.cookie.indexOf(`cookiesAllowed=`);
		return i === -1 ? false : true;
	}

	const allowCookies = () => {
		document.cookie = "cookiesAllowed=1";
        document.cookie = "theme=0";
	}

	const onWindowResize = () => dispatch(setIsMobile(window.innerWidth > navbarThreshold ? false : true));

	const configureTheme = () => {
		if (!cookies.theme) {
			if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
				setCookie("theme", "dark", { path: "/" });
				dispatch(setTheme("dark"));
			} else {
				setCookie("theme", "light", { path: "/" });
				dispatch(setTheme("light"));
			}
		} else {
			dispatch(setTheme(cookies.theme));
		}
	}

	useEffect(() => {
		updateIsLogged();
		window.addEventListener("resize", onWindowResize);

		dispatch(setIsMobile(window.innerWidth > navbarThreshold ? false : true));
	
		configureTheme();

		return () => {
			window.removeEventListener("resize", onWindowResize);
		}
	}, []);

	axiosJWT.interceptors.request.use(async (config) => {
		if(!localStorage.getItem("accessToken") || !localStorage.getItem("refreshToken")) {
			localStorage.setItem("accessToken", "");
			localStorage.setItem("refreshToken", "");
			dispatch(setIsLogged(false));
			dispatch(setUsername(""));
		} else {
			let currentDate = new Date();
			const decodedToken = jwtDecode(localStorage.getItem("accessToken"));
			if (decodedToken.exp *1000 < currentDate.getTime()) {
				await refreshToken(config);
			}
		}
		config.headers["Authorization"] = `Bearer ${localStorage.getItem("accessToken")}`;
		return config;
	}, err => Promise.reject(err));

	return (
		<BrowserRouter>
			<div className="App">

				<Helmet>
					<title>Bangerify</title>
					<meta name="description" content="React application" />
				</Helmet>

				{ isDebugWindowOpen && <DebugWindow /> }
				<CookieAlert isModalOpen={isCookiesModalOpen} setIsModalOpen={setIsCookiesModalOpen} allowCookies={allowCookies} />
				<ImageWindow />

				{ !isMobile ? <Navbar updateIsLogged={updateIsLogged} /> : <NavbarMobile updateIsLogged={updateIsLogged} /> }

				<Wrapper isCreatePostOpen={isCreatePostOpen} setIsCreatePostOpen={setIsCreatePostOpen} />

				{ !isMobile && <RightPanel /> }
			</div>
		</BrowserRouter>
	);
}