const HeartIcon = ({ number, click, isLiked }) => {
    return(
        <div className="HeartIcon" onClick={click}>
            <span style={{ color: isLiked ? "red" : "white", pointerEvents: "none" }}>❤</span>
            <p>{number}</p>
        </div>
    );
}

export default HeartIcon;