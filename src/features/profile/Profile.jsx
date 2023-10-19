import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { throttle } from "underscore";
import { axiosJWT } from "../../helpers/Helpers";
import Article from "../posts/Article";
import UserSample from "../../assets/userSample.png"
import Bio from "./Bio";
import { AWSUploadFile } from "../../helpers/AWS";
import { Helmet } from "react-helmet";
import { loadProfilePosts, loadProfileInfo, resetProfilePosts, resetProfileInfo, setAddedLikes } from "./profileSlice";
import { loadPostGateway } from "../../helpers/Gateway";

const Profile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const username = useSelector((state) => state.global.username);
    const isLogged = useSelector((state) => state.global.isLogged);

    const visibleNameInputElement = useRef(null);

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
                setIsChangingVisibleName(false);
                dispatch(resetProfileInfo());
                dispatch(loadProfileInfo(usernameParam));
            })
            .catch(err => console.log(err));
        } else setIsChangingVisibleName(prev => !prev);
    }

    const handleVisibleNameKeyDown = (event) => {
        if (event.key === "Enter") {
            changeVisibleName();
        }
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

    const handlePostLoading = (e) => {
        e.preventDefault();
        if (window.innerHeight + document.documentElement.scrollTop >= document.scrollingElement.scrollHeight - loadPostsBottomMargin) {
            if (canLoad) {
                loadPostGateway.execute(
                    dispatch(loadProfilePosts(usernameParam))
                )
            }
        }
    }

    const handlePostLoadingThrottled = throttle(handlePostLoading, 500);

    const handleSetAddedLikes = (id, number) => {
        dispatch(setAddedLikes({id, number}));
    }

    useEffect(() => {
        dispatch(resetProfilePosts());
        dispatch(resetProfileInfo());
        window.addEventListener("scroll", handlePostLoadingThrottled);

        dispatch(loadProfilePosts(usernameParam));
        dispatch(loadProfileInfo(usernameParam));

        return () => {
            window.removeEventListener("scroll", handlePostLoadingThrottled);
            dispatch(resetProfilePosts());
            dispatch(resetProfileInfo());
        }
    }, []);

    useEffect(() => {
        if (isChangingProfilePicture) {
            setChangedProfilePicture(profilePictureUrl);
        }
    }, [isChangingProfilePicture]);

    const postElements = posts.map(e => <Article key={e.id} id={e.id} postVisibleName={e.visible_name} utcDate={e.date} text={e.text} postUsername={e.username} images={e.images} profilePictureUrl={e.profilePictureUrl} username={username} grade={e.grade} isLogged={isLogged} likes={e.likes} isLiked={e.isLiked} addedLikes={e.addedLikes} setAddedLikes={handleSetAddedLikes} />);

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
                                <input 
                                    type="text"
                                    value={changedVisibleName}
                                    ref={visibleNameInputElement}
                                    required="required"
                                    onKeyDown={handleVisibleNameKeyDown}
                                    onChange={(e) => setChangedVisibleName(e.target.value)}
                                    autoFocus={true}
                                />
                                <button
                                    disabled={!changedVisibleName}
                                    onClick={changeVisibleName}
                                    style={{ border: "none", background: "none", cursor: "pointer" }}
                                >✔️</button>
                            </> }

                            <button
                                style={{ border: "none", background: "none", cursor: "pointer" }}
                                onClick={() => {
                                    // if (!isChangingVisibleName) {
                                    //     visibleNameInputElement.current.;
                                    // }
                                    setIsChangingVisibleName(prev => !prev);
                                }}
                            >{ isChangingVisibleName ? "❌" : "🖊️" }</button>
                        </> }
                        {getGradeIcon(grade)}
                    </h3>
                    <p style={{ color: "var(--black)" }}>@{profileUsername}</p>
                </section> }

            </section>

            <Bio isChangingBio={isChangingBio} setIsChangingBio={setIsChangingBio} bio={bio} changedBio={changedBio} setChangedBio={setChangedBio} usernameParam={usernameParam} />

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