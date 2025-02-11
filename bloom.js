document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);

    // ✅ Smooth scrolling with Lenis
    const lenis = new Lenis({ smooth: true });

    function raf(time) {
        lenis.raf(time * 1000);
    }
    gsap.ticker.add(raf);
    lenis.start();

    const stickySection = document.querySelector(".sticky");
    const textElement = document.querySelector(".sticky-header h1"); // ✅ Only target text

    const cards = gsap.utils.toArray(".moving-card");

    const stickyHeight = window.innerHeight * 8; // ✅ Increased scroll height

    // ✅ Fast scrolling text animation
    gsap.to(textElement, {
        x: () => -1 * (textElement.offsetWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: {
            trigger: ".sticky",
            start: "top bottom", // ✅ Starts after previous section leaves viewport
            end: `+=${stickyHeight}px`,
            scrub: true
        }
    });

    // ✅ Unique Movements for 6 Cards
    const transforms = [
        [[10, 50, -10, 10, -30], [20, -10, -45, 20, 60]],
        [[0, 47.5, -10, 15, 40], [-25, 15, -45, 30, -60]],
        [[0, 52.5, -10, 5, -50], [15, -5, -40, 60, 30]],
        [[0, 50, 30, -80, 10], [20, -10, 60, 5, -20]],
        [[0, 55, -15, 30, -10], [25, -15, 60, 95, 50]],
        [[0, 60, -20, 50, 0], [30, -20, 75, 120, -40]]
    ];

    ScrollTrigger.create({
        trigger: stickySection,
        start: "top top",
        end: `+=${stickyHeight}px`,
        pin: true,
        pinSpacing: true,
        onUpdate: (self) => {
            const progress = self.progress;
            cards.forEach((card, index) => {
                const delay = index * (0.75 / cards.length);
                const cardProgress = Math.max(0, Math.min((progress - delay) * 2, 1));

                if (cardProgress > 0) {
                    const cardStartX = 25;
                    const cardEndX = -650;
                    const yPos = transforms[index][0];
                    const rotations = transforms[index][1];

                    const cardX = gsap.utils.interpolate(cardStartX, cardEndX, cardProgress);
                    const yProgress = cardProgress * 3;
                    const yIndex = Math.min(Math.floor(yProgress), yPos.length - 2);
                    const yInterpolation = yProgress - yIndex;
                    const cardY = gsap.utils.interpolate(yPos[yIndex], yPos[yIndex + 1], yInterpolation);
                    const cardRotation = gsap.utils.interpolate(rotations[yIndex], rotations[yIndex + 1], yInterpolation);

                    gsap.set(card, {
                        xPercent: cardX,
                        yPercent: cardY,
                        rotation: cardRotation,
                        opacity: 1,
                    });
                } else {
                    gsap.set(card, { opacity: 0 });
                }
            });
        }
    });

    ScrollTrigger.refresh();
});



// ===================== HERO SECTION ANIMATIONS =====================

window.onload = function () {
    gsap.registerPlugin(ScrollTrigger); // ✅ Corrected plugin registration

    // ✅ Hero Text Moves to Right
    gsap.to(".hero-info h1", {
        x: 60,
        opacity: 1,
        scrollTrigger: {
            trigger: ".hero-section",
            start: "top 80%", // Adjusted for earlier triggering
            end: "bottom top",
            scrub: true
        }
    });

    // ✅ Gaming Text Moves to Left
    gsap.to(".gaming-text", {
        x: -100,
        opacity: 1,
        scrollTrigger: {
            trigger: ".hero-section",
            start: "top 80%",
            end: "bottom top",
            scrub: true
        }
    });

    // ✅ Hero Section Clip Path Animation
    gsap.set(".hero-section", {
        clipPath: "polygon(0 0, 100% 0%, 100% 100%, 0% 100%)"
    });

    gsap.to(".hero-section", {
        clipPath: "polygon(0 0, 100% 0, 98% 100%, 0% 100%)",
        scrollTrigger: {
            trigger: ".hero-section",
            start: "top center",
            end: "bottom top",
            scrub: true
        }
    });

    // ✅ Zoom-in effect on About Video
    gsap.fromTo(".about-video video", 
        { scale: 1 }, // Start normal
        { 
            scale: 1.5, // Zoom in effect
            ease: "power2.out",
            scrollTrigger: {
                trigger: ".about-section",
                start: "top 75%", // Adjusted for earlier triggering
                end: "top 30%",
                scrub: true,
            }
        }
    );

    // ✅ Fade-in effect for About Text
    gsap.fromTo(".about-text", 
        { opacity: 0, y: 50 }, // Start hidden
        { 
            opacity: 1, 
            y: 0,
            duration: 1.5,
            ease: "power2.out",
            scrollTrigger: {
                trigger: ".about-video",
                start: "top 60%", // Appears after zoom starts
                toggleActions: "play none none reverse"
            }
        }
    );

    // ✅ Zoom-out effect when scrolling further
    gsap.to(".about-video video", {
        scale: 1, // Zooms back to normal
        ease: "power2.out",
        scrollTrigger: {
            trigger: ".about-section",
            start: "center center", // Starts zooming out after reaching center
            end: "bottom top",      // Ends when section leaves viewport
            scrub: true,            // Smooth scroll effect
        }
    });

    ScrollTrigger.refresh(); // ✅ Ensures all animations are recalculated
};

// ===================== CARD TILT EFFECT =====================

document.addEventListener("DOMContentLoaded", () => {
    const card = document.querySelector(".card");

    card.addEventListener("mousemove", (e) => {
        let xAxis = ((window.innerWidth / 2 - e.pageX) / window.innerWidth) * 50;
        let yAxis = ((window.innerHeight / 2 - e.pageY) / window.innerHeight) * 50;

        xAxis = Math.max(-25, Math.min(25, xAxis));
        yAxis = Math.max(-25, Math.min(25, yAxis));

        card.style.transform = `rotateY(${xAxis}deg) rotateX(${-yAxis}deg)`;
    });

    card.addEventListener("mouseleave", () => {
        card.style.transform = "rotateY(0deg) rotateX(0deg)";
    });
});

// ===================== SLIDER IMAGE EFFECT =====================

document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll(".slide-container");

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("show");
                }
            });
        },
        { threshold: 0.3 }
    );

    sections.forEach((section) => observer.observe(section));
});


// rotating images
window.addEventListener("scroll", function () {
    let scrollY = window.scrollY; // Get current scroll position
    let rotation = scrollY * 0.2; // Adjust speed of rotation
    document.querySelector(".radio-icon").style.transform = `rotate(${rotation}deg)`;
});







