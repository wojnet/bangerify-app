import { useEffect } from "react";
import { axiosJWT } from "../Helpers";
import ReactMarkdown from "react-markdown";

const Bio = ({ isChangingBio, setIsChangingBio, bio, changedBio, setChangedBio }) => {

    useEffect(() => {
        if (isChangingBio) {
            setChangedBio(bio);
        }
    }, [isChangingBio]);

    const changeBio = () => {
        if (changedBio != bio) {
            axiosJWT.post(`${process.env.BACKEND_URL}/api/changeBio`, { newBio: changedBio })
                .then(() => document.location.reload())
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
            <section style={{ marginLeft: "50px", alignSelf: "flex-start" }}>
                <a style={{ fontSize: "12px", color: "#AAA", cursor: "pointer", textDecoration: "none" }} href="" target="_blank" rel="noopener noreferrer">HOW TO FORMAT?</a>
            </section>
            <textarea type="text" className="Bio--Change" value={changedBio} onChange={(e) => setChangedBio(e.target.value)} />
            <button className="Button1" style={{ marginTop: "10px", marginLeft: "50px", alignSelf: "flex-start" }} onClick={changeBio} >SAVE BIO</button>
        </>
    );
}

export default Bio;