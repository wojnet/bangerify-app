import { axiosJWT } from "./Helpers";

const handleLogout = async (updateIsLogged) => {
    await axiosJWT.post(`${process.env.BACKEND_URL}/api/auth/logout`, { token: localStorage.getItem("refreshToken") }, {
        headers: { authorization: "Bearer " + localStorage.getItem("accessToken") }
    })
    .then(res => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
    })
    .catch(err => console.log(err));

    updateIsLogged();
}

export default handleLogout;