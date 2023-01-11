const UpperBar = () => {
    return (
        <div className="UpperBar">
            <section className="UpperBar--Search">
                <input type="text" />
                <button>Search</button>
            </section>
            <section className="UpperBar--Buttons">
                <button>Latest</button>
                <button>Hottest</button>
                <button>Most popular</button>
            </section>
        </div>
    );
}

export default UpperBar;