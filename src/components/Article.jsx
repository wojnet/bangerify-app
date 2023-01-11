import { Link } from "react-router-dom";

const Article = ({ visibleName, date, text }) => {

    const dateObj = new Date(date);
    console.log(text);
    const lines = text.split("\n");

    return (
        <article className="Article">
            <Link to="/profile" className="Article--Link">{visibleName}</Link>
            <p className="Article--Date">{dateObj.toString()}</p>
            <article className="Article--Content">
                {/* <p>I don't like Loveless by MBV, but heard that people love it so much. Why I can't hear anything interesting in their music? Maybe except one song...</p> */}
                { lines.map(e => <p>{e}</p>) }
            </article>
        </article>
    );
}

export default Article;