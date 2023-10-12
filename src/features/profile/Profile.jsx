import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { axiosJWT } from "../../helpers/Helpers";
import Article from "../../components/Article/Article";
import UserSample from "../../assets/userSample.png"
import Bio from "./Bio";
import { AWSUploadFile } from "../../helpers/AWS";
import { Helmet } from "react-helmet";
import { loadProfilePosts, loadProfileInfo, resetProfilePosts, resetProfileInfo } from "./profileSlice";
import { loadPostGateway } from "../../helpers/Gateway";

const Profile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const username = useSelector((state) => state.global.username);
    const isLogged = useSelector((state) => state.global.isLogged);

    const { usernameParam } = useParams();
    const [profileUsername, setProfileUsername] = useState(usernameParam);

    // USER SELECTORS
    const loadingUserInfo = useSelector((state) => state.profile.loadingUserInfo);
    const visibleName = useSelector((state) => state.profile.visibleName);
    const bio = useSelector((state) => state.profile.bio);
    const grade = useSelector((state) => state.profile.grade);
    const creationDate = useSelector((state) => state.profile.creationDate);
    const profilePictureUrl = useSelector((state) => state.profile.profilePictureUrl);

    // POST SELECTORS
    const posts = useSelector((state) => state.profile.posts);
    const error = useSelector((state) => state.profile.error);
    const postsEnded = useSelector((state) => state.profile.postsEnded);
    const canLoad = useSelector((state) => state.profile.canLoad);
    const loadingPosts = useSelector((state) => state.profile.loadingPosts);
    const loadPostsBottomMargin = useSelector((state) => state.globalSettings.loadPostsBottomMargin);

    const [isChangingBio, setIsChangingBio] = useState(false);
    const [changedBio , setChangedBio] = useState("");
    
    const [isChangingProfilePicture, setIsChangingProfilePicture] = useState(false);
    const [changedProfilePicture , setChangedProfilePicture] = useState("");

    const [isChangingVisibleName, setIsChangingVisibleName] = useState(false);
    const [changedVisibleName , setChangedVisibleName] = useState("");

    const [loadedProfilePicture, setLoadedProfilePicture] = useState();
    
    const changeProfilePicture = async (_file) => {
        const url = await AWSUploadFile(_file);

        axiosJWT.post(`${process.env.BACKEND_URL}/api/changeProfilePictureUrl`, { newURL: url })
            .then(() => document.location.reload())
            .catch(err => console.log(err));
    }

    const profilePictureInput = document.createElement('input');
    profilePictureInput.type = 'file';

    profilePictureInput.onchange = (e) => { 
        changeProfilePicture(e.target.files[0]);
    }
    
    const changeVisibleName = () => {
        if (changedVisibleName !== visibleName && changedVisibleName !== "") {
            axiosJWT.post(`${process.env.BACKEND_URL}/api/changeVisibleName`, { newVisibleName: changedVisibleName })
            .then(() => {
                dispatch(resetProfileInfo());
                dispatch(loadProfileInfo());
            })
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
                return <span className="HEADADMIN">HEADADMIN</span>;
            case 4:
                return <span className="CREATOR">CREATOR</span>;
            case 348:
                return <span className="GIGACHAD">GIGACHAD</span>;
        }
    }

    // // 0. latest; 1. most liked
    // function loadPosts(_reset) {
    //     axios.post(`${process.env.BACKEND_URL}/api/getUserPosts`, { lastPostId: _reset === "reset" ? 99999999 : profilePosts.lastPostId, order: 0, author: profileUsername })
    //         .then(res => {
    //             let postsArray = res.data;

    //             setProfilePosts(prev => {
    //                 let newObj = { ...prev };
    //                 let ids = Array.from(postsArray ? postsArray : []).map(e => e.id);
    //                 newObj.lastPostId = ids.at(-1);
    //                 newObj.posts = [...newObj.posts, ...Array.from(postsArray ? postsArray : [])];
    //                 return newObj;
    //             });
    //         })
    //         .catch(err => console.log(err));
    // }

    // const setProfileInfo = () => {
    //     axios.post(`${process.env.BACKEND_URL}/api/userData/${usernameParam}`)
    //         .then(res => {
    //             if(res.data.length != 0) {
    //                 return res.data[0];
    //             } else {
    //                 console.log(`No user named ${profileUsername}`);
    //                 // return navigate(`/badUrl/${profileUsername}`);
    //             }
    //         })
    //         .then(res => {
    //             setVisibleName(res.visible_name);
    //             setBio(res.bio);
    //             setGrade(res.grade);
    //             setCreationDate(() => {
    //                 let localDate = new Date(res.creationDate);
    //                 return localDate.toLocaleDateString();
    //             });
    //             setProfilePictureUrl(res.profilePictureUrl);
    //         })
    //         .catch(err => console.log(err));
    // }

    const handlePostLoading = () => {
        if (window.innerHeight + document.documentElement.scrollTop >= document.scrollingElement.scrollHeight - loadPostsBottomMargin) {
            if (canLoad) {
                loadPostGateway.execute(
                    dispatch(loadProfilePosts(usernameParam))
                )
            }
        }
    }

    useEffect(() => {
        dispatch(resetProfilePosts());
        dispatch(resetProfileInfo());
        const scrollEventListener = window.addEventListener("scroll", (e) => {
            e.preventDefault();
            handlePostLoading();
        });

        dispatch(loadProfilePosts(usernameParam));
        dispatch(loadProfileInfo(usernameParam));

        return () => {
            window.removeEventListener("scroll", scrollEventListener);
            dispatch(resetProfilePosts());
            dispatch(resetProfileInfo());
        }
    }, []);

    useEffect(() => {
        if (isChangingProfilePicture) {
            setChangedProfilePicture(profilePictureUrl);
        }
    }, [isChangingProfilePicture]);

    const postElements = posts.map(e => <Article key={e.id} id={e.id} postVisibleName={e.visible_name} utcDate={e.date} text={e.text} postUsername={e.username} images={e.images} profilePictureUrl={e.profilePictureUrl} username={username} grade={e.grade} isLogged={isLogged} likes={e.likes} isLiked={e.isLiked} />);

    const ProfilePictureInput = () => {
        return(
            <section className="ProfilePicture--Input">
                <input type="text" value={changedProfilePicture} onChange={(e) => setChangedProfilePicture(e.target.value)} />
                <button className="Button1" onClick={() => setIsChangingProfilePicture(prev => !prev)}>CLOSE</button>
                <button className="Button1" onClick={changeProfilePicture}>CHANGE PROFILE PICTURE</button>
            </section>
        );
    }

    const visibleNameStyles = {
        0: { color: "var(--black)" },
        1: { color: "var(--gradeMod)" }, // MOD
        2: { color: "var(--gradeAdmin)" }, // ADMIN
        3: { color: "var(--gradeHeadAdmin)" }, // HEADADMIN
        4: { color: "var(--gradeCreator)" }, // CREATOR
        348: { color: "var(--gradeGigachad)" } // GIGACHAD
    }

    return (
        <div className="Profile">

            <Helmet>
                <title>{profileUsername} | Bangerify</title>
                <meta name="description" content={`${profileUsername}'s profile in Bangerify`} />
            </Helmet>

            <section className="Profile--Header">
                <img onClick={() => { if (profileUsername === username) profilePictureInput.click() }} src={profilePictureUrl ? profilePictureUrl : UserSample} style={
                    profileUsername === username ? { cursor: "pointer" } : {}
                } />

                { loadingUserInfo && <p>Loading user info...</p> }
                { !loadingUserInfo && <section>
                    <h3 style={visibleNameStyles[grade]}>
                        { !isChangingVisibleName && visibleName }
                        { profileUsername === username && <>
                            { isChangingVisibleName && <>
                                <input type="text" value={changedVisibleName} required="required" onChange={(e) => setChangedVisibleName(e.target.value)} />
                                <button onClick={changeVisibleName} style={{ border: "none", background: "none", cursor: "pointer" }}>✔️</button>
                            </> }

                            <button style={{ border: "none", background: "none", cursor: "pointer" }} onClick={() => setIsChangingVisibleName(prev => !prev)}>{ isChangingVisibleName ? "❌" : "🖊️" }</button>
                        </> }
                        {getGradeIcon(grade)}
                    </h3>
                    <p style={{ color: "var(--black)" }}>@{profileUsername}</p>
                </section> }

            </section>

            <Bio isChangingBio={isChangingBio} setIsChangingBio={setIsChangingBio} bio={bio} changedBio={changedBio} setChangedBio={setChangedBio} />

            { profileUsername === username && <button className="Button1" style={{ marginBlock: "15px 50px", marginLeft: "20px", alignSelf: "flex-start" }} onClick={() => {
                setIsChangingBio(prev => !prev);
            }}>{ !isChangingBio ? "Change BIO" : "Exit changing BIO" }</button> }
            
            <div className="Profile--Posts">
                { error && <p>{ error }</p> }
                { postElements }
            </div>
        </div>
    );
}

export default Profile;