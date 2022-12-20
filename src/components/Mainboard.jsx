import { useState, useEffect } from "react";
import axios from "axios";

const Mainboard = () => {

    useEffect(() => {
        axios.get("http://192.168.1.100:5000/api/test")
            .then(data => console.log(data.data));
    }, []);

    return (
        <div className="Mainboard">
            {/* <h1>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt ad nulla sapiente ipsa facere aspernatur voluptate? Sed ad nisi voluptatem veritatis eius consequatur quis ut, blanditiis facilis incidunt eos non!</h1>
            <h2>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam maiores adipisci asperiores reprehenderit officia explicabo voluptatem dignissimos, maxime cupiditate eligendi ullam possimus? Quia qui, mollitia officiis adipisci deserunt similique at.</h2>
            <h1>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam maiores adipisci asperiores reprehenderit officia explicabo voluptatem dignissimos, maxime cupiditate eligendi ullam possimus? Quia qui, mollitia officiis adipisci deserunt similique at.</h1>
            <h2>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam maiores adipisci asperiores reprehenderit officia explicabo voluptatem dignissimos, maxime cupiditate eligendi ullam possimus? Quia qui, mollitia officiis adipisci deserunt similique at.</h2>
            <h2>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam maiores adipisci asperiores reprehenderit officia explicabo voluptatem dignissimos, maxime cupiditate eligendi ullam possimus? Quia qui, mollitia officiis adipisci deserunt similique at.</h2>
            <h1>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam maiores adipisci asperiores reprehenderit officia explicabo voluptatem dignissimos, maxime cupiditate eligendi ullam possimus? Quia qui, mollitia officiis adipisci deserunt similique at.</h1>
            <h1>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam maiores adipisci asperiores reprehenderit officia explicabo voluptatem dignissimos, maxime cupiditate eligendi ullam possimus? Quia qui, mollitia officiis adipisci deserunt similique at.</h1>
            <h4>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam maiores adipisci asperiores reprehenderit officia explicabo voluptatem dignissimos, maxime cupiditate eligendi ullam possimus? Quia qui, mollitia officiis adipisci deserunt similique at.</h4>
            <h3>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam maiores adipisci asperiores reprehenderit officia explicabo voluptatem dignissimos, maxime cupiditate eligendi ullam possimus? Quia qui, mollitia officiis adipisci deserunt similique at.</h3>
            <h1>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam maiores adipisci asperiores reprehenderit officia explicabo voluptatem dignissimos, maxime cupiditate eligendi ullam possimus? Quia qui, mollitia officiis adipisci deserunt similique at.</h1>
            <h2>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam maiores adipisci asperiores reprehenderit officia explicabo voluptatem dignissimos, maxime cupiditate eligendi ullam possimus? Quia qui, mollitia officiis adipisci deserunt similique at.</h2> */}
        </div>
    );
}

export default Mainboard;