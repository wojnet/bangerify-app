import axios from "axios";
import { axiosJWT } from "./Helpers";

export const AWSUploadFiles = async (_files) => {
    const imageUrlArray = [];

    for (const image of _files) {
        const url = await axiosJWT.get(`${process.env.BACKEND_URL}/api/s3Url`).then(res => res.data.url).catch(err => console.error(err));

        await axios.put(url, image, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
        
        imageUrlArray.push(url.split("?")[0]);
    }

    return imageUrlArray;
}

export const AWSUploadFile = async (_file) => {

    const url = await axiosJWT.get(`${process.env.BACKEND_URL}/api/s3Url`).then(res => res.data.url).catch(err => console.error(err));

    await axios.put(url, _file, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
        
    return url.split("?")[0];
}