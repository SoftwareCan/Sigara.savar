(() => {
    const storeMenu = document.querySelector(".store-menu");
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!prefersReducedMotion && "IntersectionObserver" in window) {
        const revealTargets = document.querySelectorAll(
            ".intro-strip > div, .feature-section, .blue-band .band-copy, .band-grid article, .band-image, .download-card, .footer-grid > div"
        );

        document.body.classList.add("motion-ready");

        revealTargets.forEach((target, index) => {
            target.classList.add("reveal-item");
            target.style.setProperty("--reveal-delay", `${Math.min(index % 4, 3) * 80}ms`);
        });

        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: "0px 0px -8% 0px",
            threshold: 0.16,
        });

        revealTargets.forEach((target) => revealObserver.observe(target));
    }

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
