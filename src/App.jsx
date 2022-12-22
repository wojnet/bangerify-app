import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Mainboard from "./components/Mainboard";
import Authentication from "./components/Authentication";

export const App = () => {
	return (
		<BrowserRouter>
			<div className="App">
				<Navbar />
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