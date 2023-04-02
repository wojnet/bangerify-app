import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { axiosJWT } from "../helpers/Helpers";
import ConfirmEmail from "./Modal/ConfirmEmail";
import ResendEmail from "./Modal/ResendEmail";
import TinyLogo from "../assets/tinyLogo.png"

const Authentication = () => {

    const navigate = useNavigate();

    // 0 - Login; 1 - Register
    const [authType, setAuthType] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const submit = (e) => {
        if (e) e.preventDefault();

        if(!authType) {
            //* LOGIN
            axios.post(`${process.env.BACKEND_URL}/api/auth/login`, { username: username, password: password })
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
                                setIsEmailModalOpen(true);
                                break;
                        }
                    }
                })
                .catch(err => console.log(err));

        } else {
            //* REGISTER
            axios.post(`${process.env.BACKEND_URL}/api/auth/register`, { username: username, email: email, password: password })
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

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            submit();
        }
    }

    return (
        <div className="Authentication">
            <ConfirmEmail isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
            <ResendEmail isModalOpen={isEmailModalOpen} setIsModalOpen={setIsEmailModalOpen} />
            <form>
                <section className="Authentication--Topline">
                    <img src={TinyLogo} alt="Bangerify logo" />
                    <p>{authType ? "Register" : "Login"}</p>
                </section>
                <input type="text" onKeyDown={(e) => handleKeyDown(e)} placeholder={!authType ? "Username or Email" : "Username"} value={username} onChange={(e) => setUsername(e.target.value)} />
                { authType && <input type="text" onKeyDown={(e) => handleKeyDown(e)} placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} /> }
                <section className="Authentication--Password">
                    <input type={isPasswordVisible ? "text" : "password"} onKeyDown={(e) => handleKeyDown(e)} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <p style={ isPasswordVisible ? {} : { opacity: 0.6 } } onClick={() => {
                        setIsPasswordVisible(prev => !prev);
                    }}>👀</p>
                </section>
                <button onClick={submit}>{authType ? "Register" : "Login"}</button><br />
            </form>

            <p style={{ fontSize: 12, color: "var(--gray)", cursor: "pointer" }} onClick={() => setAuthType(prev => !prev)}>{!authType ? "Register" : "Login"} instead</p>
        </div>
    );
}

export default Authentication;