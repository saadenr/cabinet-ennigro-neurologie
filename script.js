(() => {
  "use strict";
  document.documentElement.classList.add("js");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const nav = document.querySelector(".site-nav");
  const toggle = document.querySelector(".nav-toggle");
  const closeMenu = () => {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Ouvrir le menu");
  };
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute(
      "aria-label",
      open ? "Fermer le menu" : "Ouvrir le menu",
    );
  });
  nav.addEventListener("click", (e) => {
    if (e.target.closest("a")) closeMenu();
  });
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".site-header")) closeMenu();
    const a = e.target.closest("a[href]");
    if (!a || !window.cabinetPrivacy?.allowed() || typeof window.gtag !== "function") return;
    // Track intent only. A telephone click is not a confirmed call or appointment.
    if (a.getAttribute("href").startsWith("tel:")) {
      window.gtag("event", "clic_telephone", {
        event_category: "contact",
        event_label: "appel cabinet",
      });
      if (a.dataset.adsConversion === "true")
        window.gtag("event", "conversion", {
          send_to: "AW-17738408073/E-GBCKG53cEbEInBqopC",
        });
    } else if (a.hostname === "wa.me") {
      window.gtag("event", "clic_whatsapp", {
        event_category: "contact",
        event_label: "WhatsApp cabinet",
      });
      window.gtag("event", "conversion", {
        send_to: "AW-17738408073/dZvQCN6In48dEInBqopC",
        value: 0,
        currency: "MAD",
      });
    }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("open")) {
      closeMenu();
      toggle.focus();
    }
  });
  window.matchMedia("(min-width: 681px)").addEventListener("change", closeMenu);

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove("is-waiting");
            revealObserver.unobserve(entry.target);
          }
        }),
      { threshold: 0, rootMargin: "0px 0px 40px 0px" },
    );
    if (!reducedMotion.matches)
      document.querySelectorAll(".reveal").forEach((el) => {
        // Visible content never waits for an observer callback to appear.
        if (el.getBoundingClientRect().top > window.innerHeight)
          el.classList.add("is-waiting");
        revealObserver.observe(el);
      });
    const sectionObserver = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          nav.querySelectorAll("a").forEach((a) => {
            if (a.hash === "#" + entry.target.id)
              a.setAttribute("aria-current", "location");
            else a.removeAttribute("aria-current");
          });
        }),
      { rootMargin: "-15% 0px -60% 0px" },
    );
    document
      .querySelectorAll("main section[id]")
      .forEach((el) => sectionObserver.observe(el));
  }

  const video = document.querySelector("#cabinet-video");
  const play = document.querySelector("#play-tour");
  const videoError = document.querySelector(".video-error");
  const chapters = [...document.querySelectorAll("[data-tour-time]")];
  const chapterNames = [
    "Accueil du cabinet",
    "Salle d’attente",
    "Salle de consultation",
    "Salle d’EEG",
    "Salle d’ENMG",
  ];
  const chapterCaption = document.querySelector("#tour-room");
  let pendingChapter = null;
  let activeChapter = -1;
  document.querySelector(".tour-chapters").hidden = false;
  const updateChapter = () => {
    const index = Math.min(
      chapters.length - 1,
      Math.floor(video.currentTime / 5),
    );
    if (index === activeChapter) return;
    activeChapter = index;
    chapters.forEach((button, i) => {
      if (i === index) button.setAttribute("aria-current", "true");
      else button.removeAttribute("aria-current");
    });
    chapterCaption.textContent = `0${index + 1} / ${chapterNames[index]}`;
  };
  video.addEventListener("loadedmetadata", () => {
    if (pendingChapter !== null) {
      video.currentTime = pendingChapter;
      pendingChapter = null;
    }
  });
  video.addEventListener("timeupdate", updateChapter);
  chapters.forEach((button) =>
    button.addEventListener("click", () => {
      const time = Number(button.dataset.tourTime);
      if (video.readyState >= 1) video.currentTime = time;
      else pendingChapter = time;
      videoError.hidden = true;
      video.play().catch(() => {
        videoError.hidden = false;
      });
    }),
  );
  play.addEventListener("click", async () => {
    if (!video.paused) {
      video.pause();
      return;
    }
    try {
      await video.play();
      video.scrollIntoView({
        behavior: reducedMotion.matches ? "instant" : "smooth",
        block: "center",
      });
    } catch {
      videoError.hidden = false;
    }
  });
  const updateVideoButton = () => {
    play.innerHTML = video.paused
      ? '<span aria-hidden="true">▷</span> Lancer la visite <small>25 s</small>'
      : '<span aria-hidden="true">Ⅱ</span> Mettre en pause';
  };
  ["play", "pause", "ended"].forEach((event) =>
    video.addEventListener(event, updateVideoButton),
  );
  video.addEventListener("error", () => {
    videoError.hidden = false;
  });
  video.querySelector("source").addEventListener("error", () => {
    videoError.hidden = false;
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) video.pause();
  });

  const gallery = [...document.querySelectorAll("[data-gallery]")];
  const dialog = document.querySelector(".lightbox");
  const largeImage = document.querySelector("#lightbox-image");
  let photoIndex = 0;
  const showPhoto = (index) => {
    photoIndex = (index + gallery.length) % gallery.length;
    const source = gallery[photoIndex].querySelector("img");
    largeImage.src = gallery[photoIndex].href;
    largeImage.alt = source.alt;
    document.querySelector("#lightbox-caption").textContent =
      `${photoIndex + 1} / ${gallery.length} · ${source.alt}`;
  };
  gallery.forEach((link, index) =>
    link.addEventListener("click", (e) => {
      if (typeof dialog.showModal !== "function" || e.metaKey || e.ctrlKey)
        return;
      e.preventDefault();
      showPhoto(index);
      dialog.showModal();
    }),
  );
  dialog
    .querySelector(".lightbox-close")
    .addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) dialog.close();
  });
  dialog.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      showPhoto(photoIndex + (e.key === "ArrowRight" ? 1 : -1));
    }
  });
  document
    .querySelectorAll("[data-photo-dir]")
    .forEach((button) =>
      button.addEventListener("click", () =>
        showPhoto(photoIndex + Number(button.dataset.photoDir)),
      ),
    );
  const reviews = document.querySelector(".reviews");
  const reviewButtons = [...document.querySelectorAll("[data-review-dir]")];
  const updateReviewButtons = () =>
    reviewButtons.forEach((button) => {
      button.disabled =
        Number(button.dataset.reviewDir) < 0
          ? reviews.scrollLeft < 5
          : reviews.scrollLeft + reviews.clientWidth >= reviews.scrollWidth - 5;
    });
  reviewButtons.forEach((button) =>
    button.addEventListener("click", () => {
      const card = reviews.querySelector(".review");
      const gap = parseFloat(getComputedStyle(reviews).gap);
      reviews.scrollBy({
        left: Number(button.dataset.reviewDir) * (card.offsetWidth + gap),
        behavior: reducedMotion.matches ? "instant" : "smooth",
      });
    }),
  );
  reviews.addEventListener("scroll", updateReviewButtons, { passive: true });
  window.addEventListener("resize", updateReviewButtons);
  updateReviewButtons();
  document.querySelector("#year").textContent = new Date().getFullYear();
})();
