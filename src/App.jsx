import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Mainboard from "./components/Mainboard";

export const App = () => {
	return (
		<BrowserRouter>
			<div className="App">
				<Navbar />
				<div className="Wrapper">
					<Routes>
						<Route path="/" element={<Mainboard />} />
					</Routes>
				</div>
			</div>
		</BrowserRouter>
	);
}