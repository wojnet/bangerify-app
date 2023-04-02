const HeartIcon = ({ number, click, isLiked }) => {
    return(
        <div style={{ WebkitUserSelect: "none", msUserSelect: "none", userSelect: "none" }} className="HeartIcon" onClick={click}>
            <span style={{ color: isLiked ? `var(--heartColor)` : "var(--gray)", pointerEvents: "none" }}>❤</span>
            <p style={{ pointerEvents: "none" }}>{number}</p>
        </div>
    );
}

export default HeartIcon;