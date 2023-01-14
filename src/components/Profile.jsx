import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Article from "./Article";
import UserSample from "../assets/userSample.png"

const Profile = ({ username }) => {

    const navigate = useNavigate();

    const { usernameParam } = useParams();
    const [profileUsername, setProfileUsername] = useState(usernameParam);

    const [visibleName, setVisibleName] = useState("");
    const [bio, setBio] = useState("");
    const [grade, setGrade] = useState("");
    const [creationDate, setCreationDate] = useState("");
    const [profilePictureUrl, setProfilePictureUrl] = useState("");
    
    const [profilePosts, setProfilePosts] = useState({
        lastPostId: 99999999,
		posts: [

		]
    });

    // 0. latest; 1. hottest; 2. most popular
    function loadPosts() {
        axios.post("http://192.168.1.100:5000/api/getUserPosts", { lastPostId: profilePosts.lastPostId, order: 0, author: profileUsername })
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
        axios.post(`http://192.168.1.100:5000/api/userData/${usernameParam}`)
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
        updateUserData();
        setProfilePosts({
            lastPostId: 99999999,
            posts: [

            ]
        });
        loadPosts();
    }, []);

    const posts = profilePosts.posts.map(e => <Article key={e.id} visibleName={e.visible_name} utcDate={e.date} text={e.text} />);

    return (
        <div className="Profile">
            <section className="Profile--Header">
                <img src={profilePictureUrl ? profilePictureUrl : UserSample} />
                <section>
                    { visibleName && <h3>{visibleName}</h3> } { !visibleName && <h3 style={{ color: "var(--gray)" }}>loading... </h3> }
                    <p>@{profileUsername}</p>
                </section>
                {  }
            </section>
            <div className="Profile--Posts">
                { posts }
            </div>
        </div>
    );
}

export default Profile;