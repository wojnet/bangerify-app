import HeartIconBlack from "../../assets/heart-icons/heart-icon-black.svg";
import HeartIconWhite from "../../assets/heart-icons/heart-icon-white.svg";
import HeartIconRed from "../../assets/heart-icons/heart-icon-red.svg";
import { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const ArticleHeartIcon = ({ number, click, isLiked, addedLikes, hasChangedLikes }) => {
    const theme = useSelector(state => state.global.theme);

    const likedStyle = {
        color: "var(--heartColor)"
    }

    const defaultStyle = {
        color: "var(--gray)",
        pointerEvents: "none"
    }

    return(
        <div style={{ WebkitUserSelect: "none", msUserSelect: "none", userSelect: "none" }} className="ArticleHeartIcon" onClick={click}>
            {/* <span style={isLiked ? hasChangedLikes ? defaultStyle : likedStyle : hasChangedLikes ? likedStyle : defaultStyle}>❤</span> */}
            <img src={isLiked ? hasChangedLikes ? theme === "dark" ? HeartIconWhite : HeartIconBlack : HeartIconRed : hasChangedLikes ? HeartIconRed : theme === "dark" ? HeartIconWhite : HeartIconBlack} alt="heart icon" />
            <p style={{ pointerEvents: "none" }}>{number !== undefined ? number + addedLikes : "NaN"}</p>
        </div>
    );
}

export default ArticleHeartIcon;