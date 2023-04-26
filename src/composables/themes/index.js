let theme = "light";

export function useThemes() {
    function loadTheme() {
        theme = localStorage.getItem("theme") ?? "light";
    }
    function saveTheme() {
        localStorage.setItem("theme", theme);
    }

    return { loadTheme, saveTheme };
}
