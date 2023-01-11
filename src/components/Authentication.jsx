import { useState } from "react";
import { useNavigate } from "react-router-dom"
import axios from "axios";
import { axiosJWT } from "../Helpers";
import ConfirmEmail from "./Modal/ConfirmEmail"

const Authentication = () => {

    const navigate = useNavigate();

    // 0 - Login; 1 - Register
    const [authType, setAuthType] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
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
                .then(res => {
                    switch(res.data.message) {
                        case "validation error":
                            let validationErrors = [];
                            if(!res.data.isUsernameValid) validationErrors.push("nazwa użytkownika");  
                            if(!res.data.isEmailValid) validationErrors.push("email");  
                            if(!res.data.isPasswordValid) validationErrors.push("hasło");  
                            alert("Błąd walidacji w " + validationErrors.join(", "));
                            break;
                        case "account created":
                            setAuthType(false); // LOGIN
                            setUsername("");
                            setIsModalOpen(true);
                            break;
                        case "username or email exist":
                            let existErrors = [];
                            if(res.data.usernameExist) existErrors.push("użytkownik");
                            if(res.data.emailExist) existErrors.push("adres email");
                            alert("Niestety, ale " + existErrors.join(", ") + " istnieje");
                            break;
                    }
                })
                .catch(err => console.log(err));

        }
    }

    return (
        <div className="Authentication">
            <ConfirmEmail isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
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