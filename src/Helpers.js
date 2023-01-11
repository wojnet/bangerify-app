import axios from "axios";

export async function refreshToken(_config) {
    try {
        const res = await axios.post("http://192.168.1.100:5000/api/token/refresh", { token: localStorage.getItem("refreshToken") });
        localStorage.setItem("accessToken", res.data.accessToken);
        localStorage.setItem("refreshToken", res.data.refreshToken);
        _config.headers["authorization"] = "Bearer " + res.data.accessToken;
        // return res.data;

    } catch(err) {
        console.log(err);
    }
}

export const axiosJWT = axios.create({
    headers: {
        
    }
});