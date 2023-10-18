const ArticleHeartIcon = ({ number, click, isLiked, addedLikes, hasChangedLikes }) => {
    const likedStyle = {
        color: "var(--heartColor)"
    }

    const defaultStyle = {
        color: "var(--gray)",
        pointerEvents: "none"
    }

    return(
        <div style={{ WebkitUserSelect: "none", msUserSelect: "none", userSelect: "none" }} className="ArticleHeartIcon" onClick={click}>
            <span style={isLiked ? hasChangedLikes ? defaultStyle : likedStyle : hasChangedLikes ? likedStyle : defaultStyle}>❤</span>
            <p style={{ pointerEvents: "none" }}>{number !== undefined ? number + addedLikes : "NaN"}</p>
        </div>
    );
}

export default ArticleHeartIcon;