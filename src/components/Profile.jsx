import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { axiosJWT } from "../Helpers";
import Article from "./Article";
import UserSample from "../assets/userSample.png"
import Bio from "./Bio";
import BadgeAlpha from "../assets/BadgeAlpha.png";
import BadgeBeta from "../assets/BadgeBeta.png";

const Profile = ({ username }) => {

    const navigate = useNavigate();

    const { usernameParam } = useParams();
    const [profileUsername, setProfileUsername] = useState(usernameParam);
    const [canLoadPosts, setCanLoadPosts] = useState(false);

    const [visibleName, setVisibleName] = useState("");
    const [bio, setBio] = useState("");
    const [grade, setGrade] = useState("");
    const [creationDate, setCreationDate] = useState("");
    const [profilePictureUrl, setProfilePictureUrl] = useState("");

    const [isChangingBio, setIsChangingBio] = useState(false);
    const [changedBio , setChangedBio] = useState("");
    
    const [isChangingProfilePicture, setIsChangingProfilePicture] = useState(false);
    const [changedProfilePicture , setChangedProfilePicture] = useState("");

    const [isChangingVisibleName, setIsChangingVisibleName] = useState(false);
    const [changedVisibleName , setChangedVisibleName] = useState("");
    
    const [profilePosts, setProfilePosts] = useState({
        lastPostId: 99999999,
		posts: [

        ]
    });
    
    const resetLoadedPosts = () => {
        setProfileInfo({
            lastPostId: 99999999,
            posts: [
                
            ]
        });
    }
    
    const changeProfilePicture = () => {
        if (changedProfilePicture != profilePictureUrl) {
            axiosJWT.post(`${process.env.BACKEND_URL}/api/changeProfilePictureUrl`, { newURL: changedProfilePicture })
            .then(() => document.location.reload())
            .catch(err => console.log(err));
        } else setIsChangingProfilePicture(prev => !prev);
    }
    
    const changeVisibleName = () => {
        if (changedVisibleName !== visibleName && changedVisibleName !== "") {
            axiosJWT.post(`${process.env.BACKEND_URL}/api/changeVisibleName`, { newVisibleName: changedVisibleName })
            .then(() => document.location.reload())
            .catch(err => console.log(err));
        } else setIsChangingVisibleName(prev => !prev);
    }

    const getGradeIcon = () => {
        switch(grade) {
            case 0:
                return;
            case 1:
                return <span className="MOD">MOD</span>;
            case 2:
                return <span className="ADMIN">ADMIN</span>;
            case 3:
                return <span className="GOD">CREATOR</span>;
            case 348:
                return <span className="GIGACHAD">GIGACHAD</span>;
        }
    }

    // 0. latest; 1. most liked
    function loadPosts() {
        axios.post(`${process.env.BACKEND_URL}/api/getUserPosts`, { lastPostId: profilePosts.lastPostId, order: 0, author: profileUsername })
            .then(res => {
                let postsArray = res.data;
                console.log(res);

                setProfilePosts(prev => {
                    let newObj = { ...prev };
                    let ids = Array.from(postsArray ? postsArray : []).map(e => e.id);
                    newObj.lastPostId = ids.at(-1);
                    newObj.posts = [...newObj.posts, ...Array.from(postsArray ? postsArray : [])];
                    return newObj;
                });
            })
            .catch(err => console.log(err));
    }

    const setProfileInfo = () => {
        axios.post(`${process.env.BACKEND_URL}/api/userData/${usernameParam}`)
            .then(res => {
                if(res.data.length != 0) {
                    return res.data[0];
                } else {
                    console.log(`No user named ${profileUsername}`);
                    return navigate(`/badUrl/${profileUsername}`);
                }
            })
            .then(res => {
                setVisibleName(res.visible_name);
                setBio(res.bio);
                setGrade(res.grade);
                setCreationDate(() => {
                    let localDate = new Date(res.creationDate);
                    return localDate.toLocaleDateString();
                });
                setProfilePictureUrl(res.profilePictureUrl);
            })
            .catch(err => console.log(err));
    }

    const updateUserData = () => {
        setProfileInfo();
        setProfileUsername(usernameParam);
    }

    useEffect(() => {
        resetLoadedPosts();
        updateUserData();
        setProfilePosts({
            lastPostId: 99999999,
            posts: [

            ]
        });
        loadPosts();
        const scrollEventListener = window.addEventListener("scroll", (e) => {
            e.preventDefault();
            if (window.innerHeight + document.documentElement.scrollTop >= document.scrollingElement.scrollHeight - 100) {
                setCanLoadPosts(true);
            }
        });

        return () => {
            window.removeEventListener("scroll", scrollEventListener);
        }
    }, []);

    useEffect(() => {
        if(canLoadPosts) {
            loadPosts();
        }
    }, [canLoadPosts]);

    useEffect(() => {
        if (isChangingProfilePicture) {
            setChangedProfilePicture(profilePictureUrl);
        }
    }, [isChangingProfilePicture]);

    const posts = profilePosts.posts.map(e => <Article key={e.id} id={e.id} postVisibleName={e.visible_name} utcDate={e.date} text={e.text} postUsername={e.username} profilePictureUrl={e.profilePictureUrl} username={username} />);

    const ProfilePictureInput = () => {
        return(
            <section style={{ display: "flex", gap: "10px" }}>
                <input type="text" value={changedProfilePicture} onChange={(e) => setChangedProfilePicture(e.target.value)} />
                <button className="Button1" onClick={() => setIsChangingProfilePicture(prev => !prev)}>CLOSE</button>
                <button className="Button1" onClick={changeProfilePicture}>CHANGE PROFILE PICTURE</button>
            </section>
        );
    }

    return (
        <div className="Profile">
            <section className="Profile--Header">
                <img onClick={() => { if (profileUsername === username) setIsChangingProfilePicture(prev => !prev) }} src={profilePictureUrl ? profilePictureUrl : UserSample} style={
                    profileUsername === username ? { cursor: "pointer" } : {}
                } />
                <section>
                    { isChangingProfilePicture && <ProfilePictureInput /> }
                    { visibleName && <h3 style={{ color: "var(--black)" }}>
                        { !isChangingVisibleName && visibleName }
                        { profileUsername === username && <>
                            { isChangingVisibleName && <input type="text" value={changedVisibleName} required="required" onChange={(e) => setChangedVisibleName(e.target.value)} /> }
                            { isChangingVisibleName && <button onClick={changeVisibleName} style={{ border: "none", background: "none", cursor: "pointer" }}>✔️</button> }
                            <button style={{ border: "none", background: "none", cursor: "pointer" }} onClick={() => setIsChangingVisibleName(prev => !prev)}>{ isChangingVisibleName ? "❌" : "🖊️" }</button>
                        </> }
                        {getGradeIcon(grade)}
                    </h3> }
                    { !visibleName && <h3 style={{ color: "var(--gray)" }}>loading... </h3> }
                    <p style={{ color: "var(--black)" }}>@{profileUsername}</p>
                </section>
            </section>

            {/* <section style={{ alignSelf: "flex-end", marginRight: "50px", position: "absolute", top: "150px" }}>
                <img style={{ width: "40px", marginTop: "5px", marginBottom: "10px" }} src={BadgeAlpha} alt="altki" />
                <img style={{ width: "40px", marginTop: "5px", marginBottom: "10px" }} src={BadgeBeta} alt="altki" />
            </section> */}

            <Bio isChangingBio={isChangingBio} setIsChangingBio={setIsChangingBio} bio={bio} changedBio={changedBio} setChangedBio={setChangedBio} />
            
            { profileUsername === username && <button className="Button1" style={{ marginBlock: "15px 50px", marginLeft: "50px", alignSelf: "flex-start" }} onClick={() => {
                setIsChangingBio(prev => !prev);
            }}>{ !isChangingBio ? "Change BIO" : "Exit changing BIO" }</button> }
            <div className="Profile--Posts">
                { posts }
            </div>
        </div>
    );
}

export default Profile;