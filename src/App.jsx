import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Mainboard from "./components/Mainboard";
import Authentication from "./components/Authentication";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { refreshToken, axiosJWT } from "./Helpers";

export const App = () => {

	const [isLogged, setIsLogged] = useState(false);
	const [username, setUsername] = useState("");

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
		return config;
	}, err => Promise.reject(err));

	return (
		<BrowserRouter>
			<div className="App">
				<Navbar isLogged={isLogged} setIsLogged={setIsLogged} updateIsLogged={updateIsLogged} />
				<div className="Wrapper">
					<Routes>
						<Route path="/" element={<Mainboard />} />
						<Route path="/authenticate" element={<Authentication />} />
					</Routes>
				</div>
			</div>
		</BrowserRouter>
	);
}