import React, { useEffect } from "react";
import { ReactComponent as Sun } from "./Sun.svg";
import { ReactComponent as Moon } from "./Moon.svg";
import "./DarkMode.css";

const DarkMode = () => {
    const setDarkMode = () => {
        document.documentElement.setAttribute("data-theme", "dark");
        localStorage.setItem("selectedTheme", "dark");
    };

    const setLightMode = () => {
        document.documentElement.setAttribute("data-theme", "light");
        localStorage.setItem("selectedTheme", "light");
    };

    useEffect(() => {
        const selectedTheme = localStorage.getItem("selectedTheme");
        if (selectedTheme === "dark") {
            setDarkMode();
        } else {
            setLightMode();
        }
    }, []);

    const toggleTheme = (e) => {
        if (e.target.checked) {
            setDarkMode();
        } else {
            setLightMode();
        }
    };

    return (
        <div className="dark_mode">
            <input
                className="dark_mode_input"
                type="checkbox"
                id="darkmode-toggle"
                onChange={toggleTheme}
                defaultChecked={localStorage.getItem("selectedTheme") === "dark"}
            />
            <label className="dark_mode_label" htmlFor="darkmode-toggle">
                <Sun />
                <Moon />
            </label>
        </div>
    );
};

export default DarkMode;
