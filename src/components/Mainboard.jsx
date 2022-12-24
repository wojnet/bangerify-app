import { useState, useEffect } from "react";
import axios from "axios";
import Article from "./Article";

const Mainboard = () => {

    const [tajneDane, setTajneDane] = useState();

    const getTajneDane = () => {
        axios.get("http://192.168.1.100:5000/api/test", {
            headers: { authorization: "Bearer " + localStorage.getItem("accessToken") }
        })
            .then(res => setTajneDane(res.data))
            .catch(err => console.error(err));
    }

    return (
        <div className="Mainboard">
            <Article />
            <button onClick={getTajneDane}>Dostań tajne dane</button>
            { tajneDane ? tajneDane : "" }
        </div>
    );
}

export default Mainboard;