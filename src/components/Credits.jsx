import GIF from "../assets/27715574_MotionElements_subscribe-like-share_converted_667376-256x144-3s-q3.gif"

const Credits = ({ username }) => {
    const TextStyle = {
        maxWidth: "400px",
        textAlign: "center"
    }

    return(
        <div className="Credits">
            <h1>HELLO {username.toUpperCase()}!</h1>
            <img src={GIF} alt="funny gif" className="FunnyGif" />

            <p style={TextStyle}>Bangerify is a social media application project made by passionate developer team:</p>

            <p style={TextStyle}><a style={{ color: "var(--gradeCreator)", textDecoration: "underline", textDecorationStyle: "dotted", textUnderlineOffset: 4 }} href="https://github.com/wojnet" target="_blank">@wojnet</a> - Front-end & Back-end</p>
            
            <p style={TextStyle}><a 
                    style={{ color: "var(--gradeHeadadmin)", textDecoration: "underline", textDecorationStyle: "dotted", textUnderlineOffset: 4 }}
                    href="https://github.com/dKasperek" target="_blank"
                >@dKasperek</a> - iOS version</p>

            {/* <p style={TextStyle}><b>My brother</b> <a style={{ color: "var(--gradeGigachad)" }} href="http://bangerify.com/profile/kachungus" target="_blank">@kachungus</a>, <a style={{ color: "var(--gradeHeadAdmin)" }} href="http://bangerify.com/profile/kn1ght" target="_blank">@kn1ght</a> (he made that wholesome cookie), and my IT teacher <b style={{ color: "var(--gradeMod)" }}>David</b>.</p> */}
            <p>Wanna contact us? <a style={{ marginLeft: "15px", color: "#000", boxShadow: "0 0 10px #0001" }} className="Button1" href="https://wojciechglid.netlify.app/" target="_blank">WOJCIECH PORTFOLIO PAGE</a></p>
        </div>
    )
}

export default Credits;