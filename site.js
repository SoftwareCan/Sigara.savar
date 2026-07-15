(() => {
    const storeMenu = document.querySelector(".store-menu");

    if (!storeMenu) {
        return;
    }

    const trigger = storeMenu.querySelector("summary");
    const links = storeMenu.querySelectorAll("a");

    const syncExpandedState = () => {
        if (trigger) {
            trigger.setAttribute("aria-expanded", storeMenu.open ? "true" : "false");
        }
    };

    syncExpandedState();
    storeMenu.addEventListener("toggle", syncExpandedState);

    document.addEventListener("click", (event) => {
        if (!storeMenu.contains(event.target)) {
            storeMenu.removeAttribute("open");
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && storeMenu.open) {
            storeMenu.removeAttribute("open");
            trigger?.focus();
        }
    });

    links.forEach((link) => {
        link.addEventListener("click", () => {
            storeMenu.removeAttribute("open");
        });
    });
})();
