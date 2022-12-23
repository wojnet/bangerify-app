import { useState } from "react";
import { useNavigate } from "react-router-dom"
import axios from "axios";

const Authentication = () => {

    const navigate = useNavigate();

    // 0 - Login; 1 - Register
    const [authType, setAuthType] = useState(false);

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const submit = () => {

        const setAuthToken = (_token) => {
            if (_token) {
                axios.defaults.headers.common["Authorization"] = `Bearer ${_token}`;
            } else {
                delete axios.defaults.headers.common["Authorization"];
            }
        }

        if(!authType) {
            //* LOGIN
            axios.post("http://192.168.1.100:5000/api/auth/login", { username: username, password: password })
                .then(res => {
                    if(res.data.validData !== false) {
                        const accessToken = res.data.accessToken;
                        localStorage.setItem("token", accessToken);
                        setAuthToken(accessToken);
                        navigate("/");
                    } else {
                        switch(res.data.type) {
                            case "wrong username":
                                alert("Zły username");
                                break;
                            case "wrong password":
                                alert("Złe hasło");
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
            <h2>{authType ? "Register" : "Login"}</h2>
            <input type="text" placeholder={!authType ? "Username or Email" : "Username"} value={username} onChange={(e) => setUsername(e.target.value)} />
            { authType && <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} /> }
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button onClick={submit}>SUBMIT</button><br />
            <p style={{ fontSize: 12, color: "var(--gray)", cursor: "pointer" }} onClick={() => setAuthType(prev => !prev)}>{!authType ? "Register" : "Login"} instead</p>
        </div>
    );
}

export default Authentication;