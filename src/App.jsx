import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import jwtDecode from "jwt-decode";
import axios from "axios";
import { refreshToken, axiosJWT } from "./helpers/Helpers";
import Semaphore from "./helpers/Semaphore";
import Navbar from "./components/Navbar";
import NavbarMobile from "./components/NavbarMobile";
import Wrapper from "./components/Wrapper";
import RightPanel from "./components/RightPanel"
import { Helmet } from "react-helmet";
import CookieAlert from "./components/Modal/CookieAlert";
import ImageWindow from "./components/Modal/ImageWindow";

export const App = () => {

	// MOBILE STYLE CONFIG
	const navbarThreshold = 800;
	const [isMobile, setIsMobile] = useState(window.innerWidth > navbarThreshold ? false : true);

	// MODALS
	const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
	const [imageWindowState, setImageWindowState] = useState({ isOpen: false, images: [], index: 0 });
	const [isCookiesModalOpen, setIsCookiesModalOpen] = useState(false);

	// POSTS
	const [isLogged, setIsLogged] = useState(false);
	const [username, setUsername] = useState("");
	const [loadedPosts, setLoadedPosts] = useState({
		lastTimeRefreshed: 0,
		lastPostId: 99999999,
		posts: [

		]
	});

	// 0 - latest && 1 - most liked
	const [postOrder, setPostOrder] = useState(0);
	const [mostLikedPosts, setMostLikedPosts] = useState({
		posts: [],
		index: 0
	});

	// OTHERS
	const postSemaphore = new Semaphore(5);
	const date = new Date();
	const [path, setPath] = useState();
	const [theme, setTheme] = useState(false);
	// date.getTime(); ms since 1970
	
	const checkIfCookiesAllowed = () => {
		let i = document.cookie.indexOf(`cookiesAllowed=`);
		return i === -1 ? false : true;
	}

	const updateIsLogged = () => {
		if (localStorage.getItem("accessToken")) {
			axiosJWT.get(`${process.env.BACKEND_URL}/api/auth/isLogged`, {
				headers: { authorization: "Bearer " + localStorage.getItem("accessToken") }
			})
			.then(res => {
				setIsLogged(res.data.isLogged);
				setUsername(res.data.username);
				console.log(1);
			})
			.catch(err => console.log(err));
		} else {
			localStorage.setItem("accessToken", "");
			localStorage.setItem("refreshToken", "");
			setIsLogged(false);
			setUsername("");
		}	
	}

	const allowCookies = () => {
		console.log("ALLOWED COOKIES");
		document.cookie = "cookiesAllowed=1";
        document.cookie = "theme=0";
	}

	useEffect(() => {
		updateIsLogged();
		window.addEventListener("resize", () => {
			setIsMobile(window.innerWidth > navbarThreshold ? false : true);
		});
		console.log("A P P");
	}, []);

	axiosJWT.interceptors.request.use(async (config) => {
		if(!localStorage.getItem("accessToken") || !localStorage.getItem("refreshToken")) {
			localStorage.setItem("accessToken", "");
			localStorage.setItem("refreshToken", "");
			setIsLogged(false);
			setUsername("");
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

				<CookieAlert isModalOpen={isCookiesModalOpen} setIsModalOpen={setIsCookiesModalOpen} allowCookies={allowCookies} />
				<ImageWindow imageWindowState={imageWindowState} setImageWindowState={setImageWindowState} />

				{ !isMobile ? <Navbar isLogged={isLogged} setIsLogged={setIsLogged} updateIsLogged={updateIsLogged} path={path} setPath={setPath} username={username} theme={theme} setTheme={setTheme} /> : <NavbarMobile isLogged={isLogged} setIsLogged={setIsLogged} updateIsLogged={updateIsLogged} path={path} setPath={setPath} username={username} theme={theme} setTheme={setTheme} /> }

				<Wrapper path={path} setPath={setPath} isLogged={isLogged} loadedPosts={loadedPosts} setLoadedPosts={setLoadedPosts} username={username} isCreatePostOpen={isCreatePostOpen} setIsCreatePostOpen={setIsCreatePostOpen} imageWindowState={imageWindowState} setImageWindowState={setImageWindowState} postOrder={postOrder} setPostOrder={setPostOrder} mostLikedPosts={mostLikedPosts} setMostLikedPosts={setMostLikedPosts} />

				{ !isMobile && <RightPanel /> }
			</div>
		</BrowserRouter>
	);
}