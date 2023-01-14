import { Link } from "react-router-dom";

const Article = ({ visibleName, utcDate, text }) => {

    const localDate = new Date(utcDate);
    console.log(utcDate)
    const lines = text.split("\n");

    return (
        <article className="Article">
            <Link to={`/profile/${visibleName}`} className="Article--Link">{visibleName}</Link>
            <p className="Article--Date">{localDate.toLocaleDateString() + " * " + localDate.toLocaleTimeString()}</p>
            <article className="Article--Content">
                { lines.map(e => <p>{e}</p>) }
            </article>
        </article>
    );
}

export default Article;