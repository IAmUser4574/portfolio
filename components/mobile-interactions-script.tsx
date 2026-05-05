export function MobileInteractionsScript() {
  const script = `
(() => {
  const touchTimes = new WeakMap();

  function getNextTheme() {
    const root = document.documentElement;
    const isDark = root.dataset.theme === "dark" || root.classList.contains("dark");
    return isDark ? "light" : "dark";
  }

  function applyTheme(theme) {
    const root = document.documentElement;
    const isDark = theme === "dark";
    root.classList.toggle("dark", isDark);
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    window.dispatchEvent(new CustomEvent("briton-theme-change", { detail: { theme } }));
  }

  function toggleMinecraft(button) {
    const root = button.closest("[data-minecraft-root]");
    if (!root) return;

    const enabled = root.dataset.minecraftMode === "true";
    root.dataset.minecraftMode = enabled ? "false" : "true";
    button.setAttribute("aria-pressed", enabled ? "false" : "true");
    button.textContent = enabled ? "Minecraft Mode" : "Boring Mode";

    window.dispatchEvent(new CustomEvent("briton-minecraft-change", {
      detail: { enabled: !enabled }
    }));
  }

  function activate(target) {
    const themeButton = target.closest("[data-theme-toggle]");
    if (themeButton) {
      applyTheme(getNextTheme());
      return;
    }

    const minecraftButton = target.closest("[data-minecraft-toggle]");
    if (minecraftButton) {
      toggleMinecraft(minecraftButton);
    }
  }

  document.addEventListener("touchend", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const control = target.closest("[data-theme-toggle], [data-minecraft-toggle]");
    if (!control) return;

    touchTimes.set(control, Date.now());
    activate(target);
  }, { passive: true });

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const control = target.closest("[data-theme-toggle], [data-minecraft-toggle]");
    if (!control) return;

    if (Date.now() - (touchTimes.get(control) || 0) < 700) {
      return;
    }

    activate(target);
  });
})();
`;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
