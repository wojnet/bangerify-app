import axios from "axios";
import store from "../store/store";
import { addDebugLine } from "../features/debugWindow/debugWindowSlice";

export async function refreshToken(config) {
    try {
        const res = await axios.post(`${process.env.BACKEND_URL}/api/token/refresh`, { token: localStorage.getItem("refreshToken") });
        localStorage.setItem("accessToken", res.data.accessToken);
        localStorage.setItem("refreshToken", res.data.refreshToken);
        store.dispatch(addDebugLine({ name: "refreshed token?????" }));
        config.headers["authorization"] = "Bearer " + res.data.accessToken;
        // return res.data;

    } catch(err) {
        console.log(err);
    }
}

export const axiosJWT = axios.create({
    headers: {}
});

export const axiosSwitch = axios.create({
    headers: {}
});