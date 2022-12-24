import { useState } from "react";
import { useNavigate } from "react-router-dom"
import axios from "axios";
import { axiosJWT } from "../Helpers";

const Authentication = () => {

    const navigate = useNavigate();

    // 0 - Login; 1 - Register
    const [authType, setAuthType] = useState(false);

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const submit = (e) => {

        e.preventDefault();

        if(!authType) {
            //* LOGIN
            axios.post("http://192.168.1.100:5000/api/auth/login", { username: username, password: password })
                .then(res => {
                    if(res.data.validData !== false) {
                        const accessToken = res.data.accessToken;
                        const refreshToken = res.data.refreshToken;
                        localStorage.setItem("accessToken", accessToken);
                        localStorage.setItem("refreshToken", refreshToken);;
                        navigate("/");
                    } else {
                        switch(res.data.type) {
                            case "wrong username":
                                alert("Zły username");
                                break;
                            case "wrong password":
                                alert("Złe hasło");
                                break;
                            case "confirm your email first":
                                console.log(1)
                                alert("Confirm your email first");
                                break;
                        }
                        
                    }
                })
                .catch(err => console.log(err));

        } else {
            //* REGISTER
            axios.post("http://192.168.1.100:5000/api/auth/register", { username: username, email: email, password: password })
                .then(res => console.log(res))
                .catch(err => console.log(err));

        }

    }

    return (
        <div className="Authentication">
            <form onSubmit={submit}>
                <h2>{authType ? "Register" : "Login"}</h2>
                <input type="text" placeholder={!authType ? "Username or Email" : "Username"} value={username} onChange={(e) => setUsername(e.target.value)} />
                { authType && <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} /> }
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button onClick={submit}>{authType ? "Register" : "Login"}</button><br />
            </form>

            <p style={{ fontSize: 12, color: "var(--gray)", cursor: "pointer" }} onClick={() => setAuthType(prev => !prev)}>{!authType ? "Register" : "Login"} instead</p>
        </div>
    );
}

export default Authentication;