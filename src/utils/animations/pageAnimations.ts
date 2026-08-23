import gsap from "gsap";

export const animatePageIn = (container: HTMLElement) => {
    const elements = container.querySelectorAll("[data-animate]");

    if (!elements.length) return;

    gsap.fromTo(
        elements,
        {
            opacity: 0,
            y: 28,
        },
        {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: "power3.out",
            clearProps: "transform,opacity",
        }
    );
};

export const animateListIn = (container: HTMLElement) => {
    const items = container.querySelectorAll("[data-animate-item]");

    if (!items.length) return;

    gsap.fromTo(
        items,
        {
            opacity: 0,
            y: 18,
        },
        {
            opacity: 1,
            y: 0,
            duration: 0.65,
            stagger: 0.08,
            ease: "power3.out",
            clearProps: "transform,opacity",
        }
    );
};