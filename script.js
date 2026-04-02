document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const header = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const mobileMenu = document.querySelector(".mobile-menu");
  const mobileLinks = document.querySelectorAll(".mobile-nav a");
  const revealItems = document.querySelectorAll(".reveal");
  const parallaxItems = document.querySelectorAll(".parallax-item");
  const contactForm = document.querySelector("#contact-form");

  // Header scroll state
  const handleHeaderState = () => {
    if (!header) return;
    if (window.scrollY > 18) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  };

  handleHeaderState();
  window.addEventListener("scroll", handleHeaderState);

  // Mobile menu
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", () => {
      const isOpen = mobileMenu.classList.toggle("is-open");
      menuToggle.classList.toggle("is-active", isOpen);
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      body.classList.toggle("menu-open", isOpen);
    });

    mobileLinks.forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.remove("is-open");
        menuToggle.classList.remove("is-active");
        menuToggle.setAttribute("aria-expanded", "false");
        body.classList.remove("menu-open");
      });
    });
  }

  // Reveal on scroll
  if ("IntersectionObserver" in window && revealItems.length) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.14,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("in-view"));
  }

  // Light parallax
  const applyParallax = () => {
    if (!parallaxItems.length) return;

    const viewportCenter = window.innerHeight * 0.5;

    parallaxItems.forEach((item) => {
      const rect = item.getBoundingClientRect();
      const speed = parseFloat(item.dataset.parallaxSpeed || "0.08");
      const distanceFromCenter = rect.top + rect.height / 2 - viewportCenter;
      const movement = distanceFromCenter * speed * -1;
      item.style.transform = `translate3d(0, ${movement}px, 0)`;
    });
  };

  let ticking = false;
  const onScrollParallax = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        applyParallax();
        ticking = false;
      });
      ticking = true;
    }
  };

  applyParallax();
  window.addEventListener("scroll", onScrollParallax, { passive: true });
  window.addEventListener("resize", applyParallax);

  // Current page active state fallback
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll(".desktop-nav a, .mobile-nav a");

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (!href) return;

    const cleanHref = href.split("#")[0];
    if (cleanHref === currentPage) {
      link.classList.add("is-active");
    } else if (currentPage === "" && cleanHref === "index.html") {
      link.classList.add("is-active");
    }
  });

  // Contact form enhancement
  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const name = contactForm.querySelector("#name")?.value.trim() || "";
      const email = contactForm.querySelector("#email")?.value.trim() || "";
      const company = contactForm.querySelector("#company")?.value.trim() || "";
      const service = contactForm.querySelector("#service")?.value.trim() || "";
      const message = contactForm.querySelector("#message")?.value.trim() || "";

      const subject = encodeURIComponent(`Project Inquiry from ${name || "Website Visitor"}`);
      const bodyLines = [
        `Name: ${name}`,
        `Email: ${email}`,
        `Company: ${company}`,
        `Service Needed: ${service}`,
        ``,
        `Project Details:`,
        `${message}`
      ];

      const body = encodeURIComponent(bodyLines.join("\n"));
      window.location.href = `mailto:malikelzarif@gmail.com?subject=${subject}&body=${body}`;
    });
  }
});