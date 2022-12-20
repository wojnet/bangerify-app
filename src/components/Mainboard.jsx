import { useState, useEffect } from "react";
import axios from "axios";
import Article from "./Article";

const Mainboard = () => {

    useEffect(() => {
        axios.get("http://192.168.1.100:5000/api/test")
            .then(data => console.log(data.data));
    }, []);

    return (
        <div className="Mainboard">
            <Article />
        </div>
    );
}

export default Mainboard;