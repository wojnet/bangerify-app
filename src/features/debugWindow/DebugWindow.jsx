import Window from "floating-window-ui";
import { useEffect } from "react";
import { useRef } from "react";
import { useSelector } from "react-redux";

const DebugWindow = () => {
    const listElement = useRef();

    const observer = new MutationObserver(function(mutations) {
        listElement.current.scrollTop = listElement.current.scrollHeight;
    });

    const listStyle = {
        height: "100%",
        width: "90%",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto"
    }

    const lines = useSelector((state) => state.debug.lines);
    const linesElements = lines.map((e) => <p>{e.name}</p>);

    const handleResize = () => {
        alert(1);
    }

    useEffect(() => {
          observer.observe(listElement.current, {
            attributes: true,
            childList: true,
            subtree: true
          });

          return () => {
            observer.disconnect();
          }
    }, []);

    return (
        <Window
            id="DebugWindow"
            height={300}
            width={200}
            top={"calc(50% - 150px)"}
            left={10}
            resizable={true}
            titleBar={{
                icon: "♥",
                title: "Debug Window",
                buttons: { maximize: true }
            }}
            style={{
                width: "100%",
                height: "100%",
                overflow: "hidden",
                background: "#FFFC",
            }}
        >
            <ul ref={listElement} style={listStyle}>
                { linesElements }
            </ul>
        </Window>
    );
}

export default DebugWindow;