import { axiosJWT } from "./Helpers";

const handleLogout = (updateIsLogged) => {
    axiosJWT.post(`${process.env.BACKEND_URL}/api/auth/logout`, { token: localStorage.getItem("refreshToken") }, {
        headers: { authorization: "Bearer " + localStorage.getItem("accessToken") }
    })
    .then(res => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        updateIsLogged();
    })
    .catch(err => console.log(err));
}

export default handleLogout;