const CommentsIcon = ({ number, click }) => {
    return(
        <div className="CommentsIcon" onClick={click}>
            <span style={{ color: "red" }}>💬</span>
            <p>{number}</p>
        </div>
    );
}

export default CommentsIcon;