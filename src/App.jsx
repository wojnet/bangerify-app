import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { refreshToken, axiosJWT } from "./Helpers";
import Navbar from "./components/Navbar";
import Wrapper from "./components/Wrapper";

export const App = () => {

	const [path, setPath] = useState();
	const date = new Date();
	
	const [isLogged, setIsLogged] = useState(false);
	const [username, setUsername] = useState("");
	const [loadedPosts, setLoadedPosts] = useState({
		lastTimeRefreshed: 0,
		lastPostId: 99999999,
		posts: [

		]
	});
	// date.getTime(); ms since 1970

	const updateIsLogged = () => {
		console.log("Update is logged");
		axiosJWT.get("http://192.168.1.100:5000/api/auth/isLogged", {
            headers: { authorization: "Bearer " + localStorage.getItem("accessToken") }
        })
		.then(res => {
			setIsLogged(res.data.isLogged);
			setUsername(res.data.username);
		})
		.catch(err => console.log(err));
	}

	useEffect(() => {
		updateIsLogged();
	}, []);

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
				<Navbar isLogged={isLogged} setIsLogged={setIsLogged} updateIsLogged={updateIsLogged} path={path} setPath={setPath} username={username} />
				<Wrapper path={path} setPath={setPath} isLogged={isLogged} loadedPosts={loadedPosts} setLoadedPosts={setLoadedPosts} username={username} />
			</div>
		</BrowserRouter>
	);
}