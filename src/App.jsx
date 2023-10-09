// PACKAGE IMPORTS
import { useState, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { refreshToken, axiosJWT } from "./helpers/Helpers";
import { Helmet } from "react-helmet";
import DebugWindow from "./features/debugWindow/DebugWindow";

// ACTION IMPORTS
import { addDebugLine } from "./features/debugWindow/debugWindowSlice";
import { setIsLogged, setUsername } from "./globalSlice";

// COMPONENT IMPORTS
import Navbar from "./components/Navbar";
import NavbarMobile from "./components/NavbarMobile";
import Wrapper from "./components/Wrapper";
import RightPanel from "./components/RightPanel"
import CookieAlert from "./components/Modals/CookieAlert";
import ImageWindow from "./components/Modals/ImageWindow";

export const App = () => {
	const dispatch = useDispatch();

	// MOBILE STYLE CONFIG
	const navbarThreshold = 800;
	const [isMobile, setIsMobile] = useState(window.innerWidth > navbarThreshold ? false : true);

	// MODALS
	const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
	const [imageWindowState, setImageWindowState] = useState({ isOpen: false, images: [], index: 0 });
	const [isCookiesModalOpen, setIsCookiesModalOpen] = useState(false);
	const isDebugWindowOpen = useSelector((state) => state.globalSettings.isDebugWindowOpen);

	// POSTS
	const isLogged = useSelector((state) => state.global.isLogged);
	const username = useSelector((state) => state.global.username);

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
	const date = new Date();
	const [path, setPath] = useState();
	const [theme, setTheme] = useState(false);
	// date.getTime(); ms since 1970
	
	const checkIfCookiesAllowed = () => {
		let i = document.cookie.indexOf(`cookiesAllowed=`);
		return i === -1 ? false : true;
	}

	const updateIsLogged = () => {
		dispatch(addDebugLine({ name: "- updateIsLogged()" }));
		if (localStorage.getItem("accessToken") && !isLogged) {
			axios.get(`${process.env.BACKEND_URL}/api/auth/isLogged`, { //! IT WAS AXIOSJWT PREVIOUSLY THEN AXIOS AND NOW AXIOSJWT AGAIN
				headers: { authorization: "Bearer " + localStorage.getItem("accessToken") }
			})
			.then(res => {
				dispatch(setIsLogged(res.data.isLogged));
				dispatch(setUsername(res.data.username));
				dispatch(addDebugLine({ name: `Logged in as ${res.data.username}` }));
			})
			.catch(err => console.log(err));
		} else if (!localStorage.getItem("accessToken") && isLogged) {
			localStorage.setItem("accessToken", "");
			localStorage.setItem("refreshToken", "");
			dispatch(setIsLogged(false));
			dispatch(setUsername(""));
			dispatch(addDebugLine({ name: "Logged out" }));
		}	
	}

	const allowCookies = () => {
		document.cookie = "cookiesAllowed=1";
        document.cookie = "theme=0";
	}

	const onWindowResize = () => {
		setIsMobile(window.innerWidth > navbarThreshold ? false : true);
	}

	useEffect(() => {
		updateIsLogged();
		window.addEventListener("resize", onWindowResize);

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
				<ImageWindow imageWindowState={imageWindowState} setImageWindowState={setImageWindowState} />

				{ !isMobile ? <Navbar isLogged={isLogged} setIsLogged={setIsLogged} updateIsLogged={updateIsLogged} path={path} setPath={setPath} theme={theme} setTheme={setTheme} /> : <NavbarMobile isLogged={isLogged} setIsLogged={setIsLogged} updateIsLogged={updateIsLogged} path={path} setPath={setPath} theme={theme} setTheme={setTheme} /> }

				<Wrapper path={path} setPath={setPath} isLogged={isLogged} loadedPosts={loadedPosts} setLoadedPosts={setLoadedPosts} isCreatePostOpen={isCreatePostOpen} setIsCreatePostOpen={setIsCreatePostOpen} imageWindowState={imageWindowState} setImageWindowState={setImageWindowState} postOrder={postOrder} setPostOrder={setPostOrder} mostLikedPosts={mostLikedPosts} setMostLikedPosts={setMostLikedPosts} />

				{ !isMobile && <RightPanel /> }
			</div>
		</BrowserRouter>
	);
}