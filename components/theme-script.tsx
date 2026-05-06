const themeStorageKey = "briton-theme";

export function ThemeScript() {
  const script = `
(() => {
  try {
    const storedTheme = window.localStorage.getItem("${themeStorageKey}");
    const theme = storedTheme === "light" ? "light" : "dark";
    const root = document.documentElement;

    root.classList.toggle("dark", theme === "dark");
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
  } catch {
    document.documentElement.classList.add("dark");
    document.documentElement.dataset.theme = "dark";
    document.documentElement.style.colorScheme = "dark";
  }
})();
`;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
