import { useEffect } from "react";
import { axiosJWT } from "../../helpers/Helpers";
import ReactMarkdown from "react-markdown";
import { useDispatch } from "react-redux";
import { resetProfileInfo, loadProfileInfo } from "../profile/profileSlice";

const Bio = ({ isChangingBio, setIsChangingBio, bio, changedBio, setChangedBio, usernameParam }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        if (isChangingBio) {
            setChangedBio(bio);
        }
    }, [isChangingBio]);

    const changeBio = () => {
        if (changedBio != bio) {
            axiosJWT.post(`${process.env.BACKEND_URL}/api/changeBio`, { newBio: changedBio })
                .then((res) => {
                    if (res.data.message === "banned") {
                        setIsChangingBio(false);
                        alert("YOU ARE BANNED!");
                    } else if (res.data.message === "error") {
                        setIsChangingBio(false);
                        alert("ERROR");
                    } else {
                        dispatch(resetProfileInfo());
                        dispatch(loadProfileInfo(usernameParam));
                        setIsChangingBio(false);
                    }
                })
                .catch(err => console.log(err));
        } else setIsChangingBio(prev => !prev);
    }

    if (!isChangingBio) {
        return ( 
            <ReactMarkdown className="Bio">
                { bio ? bio.replaceAll("\n", "  \n") : "" }
            </ReactMarkdown>
        );
    }

    return (
        <>
            <section style={{ marginLeft: "20px", alignSelf: "flex-start" }}>
                <a style={{ fontSize: "12px", color: "#AAA", cursor: "pointer", textDecoration: "none" }} href="" target="_blank" rel="noopener noreferrer">HOW TO FORMAT?</a>
            </section>
            <textarea type="text" className="Bio--Change" value={changedBio} onChange={(e) => setChangedBio(e.target.value)} />
            <button className="Button1" style={{ marginTop: "10px", marginLeft: "20px", alignSelf: "flex-start" }} onClick={changeBio} >Save 💾</button>
        </>
    );
}

export default Bio;