const r = document.querySelector(':root');

const themeData = {
    light: [
        { name: "--black", color: "#000" },
        { name: "--white", color: "#FFF" },
        { name: "--nearBlack", color: "#333" },
        { name: "--white05", color: "#FFF8" },
        { name: "--darkGray", color: "#555" },
        { name: "--gray", color: "#888" },
        { name: "--hoverGray", color: "#E0E0E0" },
        { name: "--hoverGray05", color: "#DDD8" },
        { name: "--lightGray", color: "#EEE" },
        { name: "--lightGray05", color: "#EEE8" },
        { name: "--gradeMod", color: "rgb(134, 252, 80)" },
        { name: "--gradeAdmin", color: "rgb(14, 126, 201)" },
        { name: "--gradeHeadAdmin", color: "rgb(66, 148, 255)" },
        { name: "--gradeCreator", color: "rgb(30, 34, 255)" },
        { name: "--gradeGigachad", color: "rgb(255, 178, 78)" }
    ],
    dark: [
        { name: "--black", color: "#FFF" },
        { name: "--white", color: "#26262D" },
        { name: "--nearBlack", color: "#EFE1E1" },
        { name: "--white05", color: "#331D2C88" },
        { name: "--darkGray", color: "#ABB" },
        { name: "--gray", color: "#B1C4DF" },
        { name: "--hoverGray", color: "#373747" },
        { name: "--hoverGray05", color: "#37374788" },
        { name: "--lightGray", color: "#2C2E3B" },
        { name: "--lightGray05", color: "#2C2E3B88" },
        { name: "--gradeMod", color: "rgb(134, 252, 80)" },
        { name: "--gradeAdmin", color: "rgb(14, 126, 201)" },
        { name: "--gradeHeadAdmin", color: "rgb(115, 191, 250)" },
        { name: "--gradeCreator", color: "rgb(66, 148, 255)" },
        { name: "--gradeGigachad", color: "rgb(255, 178, 78)" }
    ]
}

export const applyTheme = (theme) => {
    themeData[theme].forEach(element => {
        r.style.setProperty(element.name, element.color);
        document.documentElement.setAttribute(
            "data-color-scheme",
            theme === "light" ? "light" : "dark"
          );
    });
}