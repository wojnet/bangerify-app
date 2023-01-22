import { useNavigate, useParams } from "react-router-dom";
import BadUrlImg from "../assets/badurl.png";

const BadUrl = () => {

    const { url } = useParams();
    const navigate = useNavigate();

    return(
        <div className="BadUrl">
            <img src={BadUrlImg} />
            <button onClick={() => {
                navigate("/");
            }}>Return to mainboard</button><br />
            <p style={{ fontSize: "14px", textAlign: "center" }}>{url} doesn't exist...<br />It was just a dream...</p>
        </div>
    );
}

export default BadUrl;