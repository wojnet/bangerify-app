const UpperBar = ({ setOrder }) => {
    return (
        <div className="UpperBar">
            {/* <section className="UpperBar--Search">
                <input type="text" />
                <button>Search</button>
            </section> */}
            <section className="UpperBar--Buttons">
                <button className="Button1" onClick={() => setOrder(0)}>Latest</button>
                <button className="Button1" onClick={() => setOrder(1)}>Most liked</button>
            </section>
        </div>
    );
}

export default UpperBar;