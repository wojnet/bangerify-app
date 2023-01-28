const HeartIcon = ({ number, click, isLiked }) => {
    return(
        <div style={{ webkitUserSelect: "none", msUserSelect: "none", userSelect: "none" }} className="HeartIcon" onClick={click}>
            <span style={{ color: isLiked ? "#E85159" : "var(--gray)", pointerEvents: "none" }}>❤</span>
            <p style={{ pointerEvents: "none" }}>{number}</p>
        </div>
    );
}

export default HeartIcon;