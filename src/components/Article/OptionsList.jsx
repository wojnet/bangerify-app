const OptionsList = ({ areSettingsOpen, setAreSettingsOpen, postUsername, username, functions }) => {

    const options = Array.from(functions).map(e => {
        if (e.auth === "author") {
            return postUsername === username && (<button onClick={e.callback}>{e.text}</button>);
        } else if (e.auth === "notAuthor") {
            return postUsername !== username && (<button onClick={e.callback}>{e.text}</button>);
        } else {
            return (<button onClick={e.callback}>{e.text}</button>);
        }
    })

    return (
        <>
            <button className="OptionsList--Button" onClick={() => setAreSettingsOpen(prev => !prev)} style={{ color: "var(--black)" }}>...</button>
            { areSettingsOpen && <section className="OptionsList">
                { options }
            </section> }
        </>
    );
}

export default OptionsList;