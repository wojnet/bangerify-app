import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { refreshToken, axiosJWT } from "./Helpers";
import Navbar from "./components/Navbar";
import NavbarMobile from "./components/NavbarMobile";
import Wrapper from "./components/Wrapper";
import CookieAlert from "./components/Modal/CookieAlert";

export const App = () => {

	const r = document.querySelector(':root');
	const navbarThreshold = 800;

	const [path, setPath] = useState();
	const date = new Date();

	const [isMobile, setIsMobile] = useState(window.innerWidth > navbarThreshold ? false : true);
	
	const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
	const [theme, setTheme] = useState(false);

	const [isCookiesModalOpen, setIsCookiesModalOpen] = useState(false);

	const [isLogged, setIsLogged] = useState(false);
	const [username, setUsername] = useState("");
	const [loadedPosts, setLoadedPosts] = useState({
		lastTimeRefreshed: 0,
		lastPostId: 99999999,
		posts: [

		]
	});
	// date.getTime(); ms since 1970
	

	const checkIfCookiesAllowed = () => {
		let i = document.cookie.indexOf(`cookiesAllowed=`);
		return i === -1 ? false : true;
	}

	const updateIsLogged = () => {
		// console.log("Update is logged");
		axiosJWT.get(`${process.env.BACKEND_URL}/api/auth/isLogged`, {
            headers: { authorization: "Bearer " + localStorage.getItem("accessToken") }
        })
		.then(res => {
			setIsLogged(res.data.isLogged);
			setUsername(res.data.username);
		})
		.catch(err => console.log(err));
	}

	const updateTheme = () => {
		if (!theme) {
			r.style.setProperty("--black", "#000");
			r.style.setProperty("--white", "#FFF");
			r.style.setProperty("--white05", "#FFF8");
			r.style.setProperty("--gray", "#888");
			r.style.setProperty("--hoverGray", "#DDD");
			r.style.setProperty("--hoverGray05", "#DDD8");
			r.style.setProperty("--lightGray", "#EEE");
			r.style.setProperty("--lightGray05", "#EEE8");
			r.style.setProperty("--gradeMod", "rgb(134, 252, 80)");
			r.style.setProperty("--gradeAdmin", "rgb(14, 126, 201)");
			r.style.setProperty("--gradeHeadAdmin", "rgb(66, 148, 255)");
			r.style.setProperty("--gradeCreator", "rgb(30, 34, 255)");
			r.style.setProperty("--gradeGigachad", "rgb(255, 178, 78)");
		} else {
			r.style.setProperty("--black", "#FFF");
			r.style.setProperty("--white", "#111");
			r.style.setProperty("--white05", "#0008");
			r.style.setProperty("--gray", "#888");
			r.style.setProperty("--hoverGray", "#333");
			r.style.setProperty("--hoverGray05", "#3338");
			r.style.setProperty("--lightGray", "#222");
			r.style.setProperty("--lightGray05", "#2228");
			r.style.setProperty("--gradeMod", "rgb(134, 252, 80)");
			r.style.setProperty("--gradeAdmin", "rgb(14, 126, 201)");
			r.style.setProperty("--gradeHeadAdmin", "rgb(115, 191, 250)");
			r.style.setProperty("--gradeCreator", "rgb(66, 148, 255)");
			r.style.setProperty("--gradeGigachad", "rgb(255, 178, 78)");
		}

		if (checkIfCookiesAllowed()) {
			document.cookie = `theme=${theme ? 1 : 0}`;
		}
	}

	const allowCookies = () => {
		console.log("ALLOWED COOKIES");
		document.cookie = "cookiesAllowed=1";
        document.cookie = "theme=0";
	}

	useEffect(() => {
		if (!checkIfCookiesAllowed()) {
			setIsCookiesModalOpen(true);
		} else {
			const a = document.cookie.split(";").filter(e => e.split("=")[0] === " theme" || e.split("=")[0] === "theme");
			if (a.length > 0) {
				const value = a[0].split("=")[1];
				setTheme(value === "0" ? false : true);
			}

			updateTheme();
		}
		updateIsLogged();
		updateTheme();

		function updateOnResize() {
			setIsMobile(window.innerWidth > navbarThreshold ? false : true);
		}

		window.addEventListener("resize", updateOnResize);

	}, []);

	useEffect(() => {
		updateTheme();
	}, [theme]);

	axiosJWT.interceptors.request.use(async (config) => {
		if(!localStorage.getItem("accessToken")) {
			localStorage.setItem("accessToken", "");
			localStorage.setItem("refreshToken", "");
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
				<CookieAlert isModalOpen={isCookiesModalOpen} setIsModalOpen={setIsCookiesModalOpen} allowCookies={allowCookies} />

				{ !isMobile ? <Navbar isLogged={isLogged} setIsLogged={setIsLogged} updateIsLogged={updateIsLogged} path={path} setPath={setPath} username={username} theme={theme} setTheme={setTheme} updateTheme={updateTheme} /> : <NavbarMobile isLogged={isLogged} setIsLogged={setIsLogged} updateIsLogged={updateIsLogged} path={path} setPath={setPath} username={username} theme={theme} setTheme={setTheme} updateTheme={updateTheme} /> }

				<Wrapper path={path} setPath={setPath} isLogged={isLogged} loadedPosts={loadedPosts} setLoadedPosts={setLoadedPosts} username={username} isCreatePostOpen={isCreatePostOpen} setIsCreatePostOpen={setIsCreatePostOpen} />
				{ isMobile }
			</div>
		</BrowserRouter>
	);
}