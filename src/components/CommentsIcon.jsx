const CommentsIcon = ({ number, click }) => {
    return(
        <div className="CommentsIcon" onClick={click}>
            <span>☲</span>
            <p>{number}</p>
        </div>
    );
}

export default CommentsIcon;