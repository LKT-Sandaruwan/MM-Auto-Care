// Load navbar and footer
document.addEventListener("DOMContentLoaded", function () {
  // Load navbar
  fetch("./Components/navbar.html")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Navbar not found");
      }
      return response.text();
    })
    .then((data) => {
      document.getElementById("navbar-placeholder").innerHTML = data;
      initializeNavbar();
    })
    .catch((error) => {
      console.error("Error loading navbar:", error);
      // Fallback: Try alternative path
      fetch("navbar.html")
        .then((response) => response.text())
        .then((data) => {
          document.getElementById("navbar-placeholder").innerHTML = data;
          initializeNavbar();
        })
        .catch((err) =>
          console.error("Failed to load navbar from both paths:", err)
        );
    });

  // Load footer
  fetch("./Components/footer.html")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Footer not found");
      }
      return response.text();
    })
    .then((data) => {
      document.getElementById("footer-placeholder").innerHTML = data;
    })
    .catch((error) => {
      console.error("Error loading footer:", error);
      // Fallback: Try alternative path
      fetch("footer.html")
        .then((response) => response.text())
        .then((data) => {
          document.getElementById("footer-placeholder").innerHTML = data;
        })
        .catch((err) =>
          console.error("Failed to load footer from both paths:", err)
        );
    });

  // Initialize other features
  initializeAnimations();
  initializeContactForm();
  initializeCounters();
});

// Initialize navbar functionality
function initializeNavbar() {
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");
  const servicesDropdown = document.getElementById("servicesDropdown");

  if (hamburger) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      navLinks.classList.toggle("active");
    });
  }

  // Mobile dropdown toggle
  if (window.innerWidth <= 768 && servicesDropdown) {
    servicesDropdown.addEventListener("click", (e) => {
      if (
        e.target.tagName === "A" &&
        e.target.textContent.includes("Services")
      ) {
        e.preventDefault();
        servicesDropdown.classList.toggle("active");
      }
    });
  }

  // Close mobile menu when clicking a link
  const links = document.querySelectorAll(".nav-links a");
  links.forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 768) {
        navLinks.classList.remove("active");
        if (hamburger) {
          hamburger.classList.remove("active");
        }
      }
    });
  });

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href !== "#" && href.length > 1) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }
    });
  });

  // Active page highlighting
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const navLinksItems = document.querySelectorAll(".nav-links a");
  navLinksItems.forEach((link) => {
    if (link.getAttribute("href") === currentPage) {
      link.style.color = "var(--yellow)";
    }
  });
}

// Initialize animations on scroll
function initializeAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  // Observe cards and service cards
  const cards = document.querySelectorAll(
    ".card, .service-card, .value-card, .team-card, .feature"
  );
  cards.forEach((card) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(30px)";
    card.style.transition = "all 0.6s ease-out";
    observer.observe(card);
  });
}

// Initialize contact form
function initializeContactForm() {
  const contactForm = document.getElementById("contactForm");

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const formMessage = document.getElementById("formMessage");
      const submitBtn = contactForm.querySelector(".submit-btn");

      // Get form data
      const formData = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        service: document.getElementById("service").value,
        message: document.getElementById("message").value,
      };

      // Disable submit button
      submitBtn.disabled = true;
      submitBtn.innerHTML = "<span>Sending...</span>";

      // Simulate form submission (replace with actual API call)
      setTimeout(() => {
        // Show success message
        formMessage.className = "form-message success";
        formMessage.textContent =
          "Thank you for your message! We will get back to you soon.";

        // Reset form
        contactForm.reset();

        // Re-enable submit button
        submitBtn.disabled = false;
        submitBtn.innerHTML = "<span>Send Message</span>";

        // Hide message after 5 seconds
        setTimeout(() => {
          formMessage.style.display = "none";
        }, 5000);

        // Log form data (for development)
        console.log("Form submitted:", formData);
      }, 1500);
    });

    // Real-time validation
    const inputs = contactForm.querySelectorAll("input, select, textarea");
    inputs.forEach((input) => {
      input.addEventListener("blur", function () {
        if (this.value.trim() === "") {
          this.style.borderColor = "var(--red)";
        } else {
          this.style.borderColor = "var(--yellow)";
          setTimeout(() => {
            this.style.borderColor = "transparent";
          }, 1000);
        }
      });
    });
  }
}

// Initialize counters for stats
function initializeCounters() {
  const counters = document.querySelectorAll(".stat-number");

  if (counters.length > 0) {
    const observerOptions = {
      threshold: 0.5,
    };

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (
          entry.isIntersecting &&
          !entry.target.classList.contains("counted")
        ) {
          entry.target.classList.add("counted");
          animateCounter(entry.target);
        }
      });
    }, observerOptions);

    counters.forEach((counter) => {
      counterObserver.observe(counter);
    });
  }
}

// Animate counter
function animateCounter(element) {
  const target = parseInt(element.getAttribute("data-target"));
  const duration = 2000;
  const increment = target / (duration / 16);
  let current = 0;

  const updateCounter = () => {
    current += increment;
    if (current < target) {
      element.textContent = Math.floor(current);
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = target;
    }
  };

  updateCounter();
}

// Scroll to top button (optional feature)
window.addEventListener("scroll", function () {
  const scrollBtn = document.getElementById("scrollToTop");
  if (scrollBtn) {
    if (window.pageYOffset > 300) {
      scrollBtn.style.display = "block";
    } else {
      scrollBtn.style.display = "none";
    }
  }
});

// Handle window resize for responsive features
let resizeTimer;
window.addEventListener("resize", function () {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(function () {
    // Reload navbar functionality on resize
    if (window.innerWidth > 768) {
      const navLinks = document.getElementById("navLinks");
      const hamburger = document.getElementById("hamburger");
      if (navLinks) navLinks.classList.remove("active");
      if (hamburger) hamburger.classList.remove("active");
    }
  }, 250);
});

// Add smooth page transitions
window.addEventListener("beforeunload", function () {
  document.body.style.opacity = "0";
  document.body.style.transition = "opacity 0.3s";
});

// Page load animation
window.addEventListener("load", function () {
  document.body.style.opacity = "1";
});

// Prevent form resubmission on page refresh
if (window.history.replaceState) {
  window.history.replaceState(null, null, window.location.href);
}

// Console welcome message
console.log(
  "%cMM AUTO CARE",
  "font-size: 24px; color: #f1c40f; font-weight: bold;"
);
console.log("%cWebsite by MM Auto Care Development Team", "color: #ccc;");

document.addEventListener("DOMContentLoaded", () => {
  const heroCar = document.querySelector(".hero-car");

  // Page load animation
  setTimeout(() => {
    heroCar.classList.add("loaded");
  }, 300);

  // Scroll animation
  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;

    if (scrollY > 120) {
      heroCar.classList.add("scroll-out");
    } else {
      heroCar.classList.remove("scroll-out");
    }
  });
});
