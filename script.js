document.addEventListener("DOMContentLoaded", function () {
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".site-nav");
  const navLinks = document.querySelectorAll('.site-nav a[href^="#"]');

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      const isOpen = navMenu.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      if (navMenu && navToggle) {
        navMenu.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  });

  if (navLinks.length > 0) {
    const updateActiveLink = function () {
      const headerHeight = document.querySelector(".site-header")?.offsetHeight || 90;
      const scrollOffset = headerHeight + 18;
      let currentId = "accueil";

      navLinks.forEach(function (link) {
        const targetId = link.getAttribute("href").slice(1);
        const section = document.getElementById(targetId);
        if (section && window.scrollY + scrollOffset >= section.offsetTop) {
          currentId = targetId;
        }
      });

      navLinks.forEach(function (link) {
        const isActive = link.getAttribute("href") === "#" + currentId;
        link.classList.toggle("active", isActive);
      });
    };

    window.addEventListener("scroll", updateActiveLink);
    updateActiveLink();
  }

  const revealItems = document.querySelectorAll(".reveal");
  revealItems.forEach(function (item, index) {
    item.style.transitionDelay = String((index % 4) * 45) + "ms";
  });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -10% 0px" }
    );

    revealItems.forEach(function (item) {
      const rect = item.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.92) {
        item.classList.add("visible");
      } else {
        observer.observe(item);
      }
    });
  } else {
    revealItems.forEach(function (item) {
      item.classList.add("visible");
    });
  }

  document.querySelectorAll("[data-carousel]").forEach(function (carousel) {
    const slides = carousel.querySelectorAll(".carousel-slide");
    let current = 0;
    let startX = 0;
    let autoTimer = null;

    const showSlide = function (index) {
      current = (index + slides.length) % slides.length;
      const left = (current - 1 + slides.length) % slides.length;
      const right = (current + 1) % slides.length;

      slides.forEach(function (slide, i) {
        slide.classList.remove("is-left", "is-center", "is-right", "is-hidden");
        if (i === current) {
          slide.classList.add("is-center");
          slide.setAttribute("aria-hidden", "false");
        } else if (i === left) {
          slide.classList.add("is-left");
          slide.setAttribute("aria-hidden", "false");
        } else if (i === right) {
          slide.classList.add("is-right");
          slide.setAttribute("aria-hidden", "false");
        } else {
          slide.classList.add("is-hidden");
          slide.setAttribute("aria-hidden", "true");
        }
      });
    };

    slides.forEach(function (slide, i) {
      slide.addEventListener("click", function () {
        if (slide.classList.contains("is-left")) {
          showSlide(current - 1);
        } else if (slide.classList.contains("is-right")) {
          showSlide(current + 1);
        } else {
          showSlide(i);
        }
      });
    });

    const stopAuto = function () {
      if (autoTimer) {
        clearInterval(autoTimer);
        autoTimer = null;
      }
    };

    const startAuto = function () {
      stopAuto();
      autoTimer = setInterval(function () {
        showSlide(current + 1);
      }, 10000);
    };

    carousel.addEventListener("touchstart", function (event) {
      stopAuto();
      startX = event.touches[0].clientX;
    });

    carousel.addEventListener("touchend", function (event) {
      const endX = event.changedTouches[0].clientX;
      const delta = startX - endX;
      if (Math.abs(delta) > 40) {
        if (delta > 0) {
          showSlide(current + 1);
        } else {
          showSlide(current - 1);
        }
      }
      startAuto();
    });

    carousel.addEventListener("mouseenter", stopAuto);
    carousel.addEventListener("mouseleave", startAuto);
    carousel.addEventListener("focusin", stopAuto);
    carousel.addEventListener("focusout", startAuto);

    carousel.addEventListener("keydown", function (event) {
      if (event.key === "ArrowLeft") {
        showSlide(current - 1);
      } else if (event.key === "ArrowRight") {
        showSlide(current + 1);
      }
    });

    showSlide(0);
    startAuto();
  });

  document.querySelectorAll("[data-testimonials-carousel]").forEach(function (carousel) {
    const slides = carousel.querySelectorAll(".testimonial-slide");
    const dots = carousel.querySelectorAll(".testimonials-dots button");
    let current = 0;
    let timer = null;

    const show = function (index) {
      current = (index + slides.length) % slides.length;
      const left = (current - 1 + slides.length) % slides.length;
      const right = (current + 1) % slides.length;

      slides.forEach(function (slide, i) {
        slide.classList.remove("is-left", "is-center", "is-right", "is-hidden");
        if (i === current) {
          slide.classList.add("is-center");
        } else if (i === left) {
          slide.classList.add("is-left");
        } else if (i === right) {
          slide.classList.add("is-right");
        } else {
          slide.classList.add("is-hidden");
        }
      });
      if (dots.length > 0) {
        dots.forEach(function (dot, i) {
          dot.classList.toggle("active", i === current);
        });
      }
    };

    const stop = function () {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    };

    const start = function () {
      stop();
      timer = setInterval(function () {
        show(current + 1);
      }, 8000);
    };

    if (dots.length > 0) {
      dots.forEach(function (dot, i) {
        dot.addEventListener("click", function () {
          show(i);
          start();
        });
      });
    }

    slides.forEach(function (slide) {
      slide.addEventListener("click", function () {
        if (slide.classList.contains("is-left")) {
          show(current - 1);
          start();
        } else if (slide.classList.contains("is-right")) {
          show(current + 1);
          start();
        }
      });
    });

    carousel.addEventListener("mouseenter", stop);
    carousel.addEventListener("mouseleave", start);
    carousel.addEventListener("touchstart", stop, { passive: true });
    carousel.addEventListener("touchend", start, { passive: true });

    show(0);
    start();
  });

  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    const feedback = document.getElementById("form-feedback");

    const setFeedback = function (message, type) {
      feedback.textContent = message;
      feedback.className = "form-feedback " + type;
    };

    contactForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const phone = document.getElementById("phone").value.trim();
      const message = document.getElementById("message").value.trim();
      const website = contactForm.querySelector('input[name="website"]')?.value.trim();

      if (!name || !email || !message) {
        setFeedback("Veuillez remplir Nom, Email et Message.", "error");
        return;
      }

      const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!emailIsValid) {
        setFeedback("Veuillez saisir une adresse email valide.", "error");
        return;
      }

      if (website) {
        setFeedback("Envoi bloqué.", "error");
        return;
      }

      const payload = {
        type: "contact_request",
        patient: {
          name: name,
          email: email,
          phone: phone || null
        },
        message: message,
        submittedAt: new Date().toISOString()
      };
      console.info("Contact (JSON):", payload);

      const endpoint = (contactForm.dataset.endpoint || "").trim();
      const mailto = (contactForm.dataset.mailto || "").trim();

      if (endpoint) {
        try {
          const response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });

          if (!response.ok) {
            throw new Error("network_error");
          }

          setFeedback("Votre message a bien été envoyé. Nous vous recontacterons rapidement.", "success");
          contactForm.reset();
          return;
        } catch (error) {
          setFeedback("L'envoi direct a échoué. Ouverture de votre messagerie...", "error");
        }
      }

      if (mailto) {
        const subject = encodeURIComponent("Demande de contact - Cabinet de neurologie");
        const body = encodeURIComponent(
          "Nom: " + name + "\n" +
          "Email: " + email + "\n" +
          "Téléphone: " + (phone || "Non renseigné") + "\n\n" +
          "Message:\n" + message
        );
        window.location.href = "mailto:" + mailto + "?subject=" + subject + "&body=" + body;
        setFeedback("Votre messagerie s'est ouverte pour finaliser l'envoi.", "success");
        return;
      }

      setFeedback("Aucune destination d'envoi n'est configurée.", "error");
    });
  }
});
