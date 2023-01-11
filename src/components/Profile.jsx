import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import UserSample from "../assets/userSample.png"

const Profile = () => {

    const { usernameParam } = useParams();
    const [username, setUsername] = useState(null);
    const [visibleName, setvisibleName] = useState(null);

    const updateUserData = () => {
        setUsername(usernameParam);
    }

    useEffect(() => {
        updateUserData();
    }, [usernameParam]);

    return (
        <div className="Profile">
            <section className="Profile--Header">
                <img src={UserSample} />
                <section>
                    { visibleName && <h3>{visibleName}</h3> } { !visibleName && <h3 style={{ color: "var(--gray)" }}>loading... </h3> }
                    <p>@{username}</p>
                </section>
            </section>
        </div>
    );
}

export default Profile;