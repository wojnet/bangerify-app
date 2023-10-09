const CommentsIcon = ({ number, click }) => {
    return(
        <div style={{ WebkitUserSelect: "none", msUserSelect: "none", userSelect: "none" }} className="CommentsIcon" onClick={click}>
            <span>☲</span>
            <p>{number}</p>
        </div>
    );
}

export default CommentsIcon;