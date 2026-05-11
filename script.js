const canvas = document.getElementById("bg-canvas");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const revealItems = document.querySelectorAll(".reveal");
const cursorGlow = document.querySelector(".cursor-glow");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

if (revealItems.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  revealItems.forEach((item) => observer.observe(item));
}

if (cursorGlow) {
  window.addEventListener("mousemove", (event) => {
    document.body.style.setProperty("--cursor-x", `${event.clientX}px`);
    document.body.style.setProperty("--cursor-y", `${event.clientY}px`);
    document.body.classList.add("cursor-active");
  });

  window.addEventListener("mouseleave", () => {
    document.body.classList.remove("cursor-active");
  });
}

if (canvas) {
  const context = canvas.getContext("2d");
  let width = 0;
  let height = 0;
  let particles = [];

  const resizeCanvas = () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    particles = Array.from({ length: 36 }, createParticle);
  };

  const createParticle = () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: Math.random() * 2.4 + 0.8,
    speedX: (Math.random() - 0.5) * 0.18,
    speedY: Math.random() * 0.32 + 0.08,
    alpha: Math.random() * 0.4 + 0.08,
  });

  const drawBackdrop = () => {
    const glowA = context.createRadialGradient(width * 0.18, height * 0.22, 0, width * 0.18, height * 0.22, 260);
    glowA.addColorStop(0, "rgba(88, 215, 247, 0.14)");
    glowA.addColorStop(1, "rgba(88, 215, 247, 0)");
    context.fillStyle = glowA;
    context.fillRect(0, 0, width, height);

    const glowB = context.createRadialGradient(width * 0.82, height * 0.16, 0, width * 0.82, height * 0.16, 220);
    glowB.addColorStop(0, "rgba(141, 228, 199, 0.12)");
    glowB.addColorStop(1, "rgba(141, 228, 199, 0)");
    context.fillStyle = glowB;
    context.fillRect(0, 0, width, height);
  };

  const drawParticles = () => {
    particles.forEach((particle) => {
      particle.x += particle.speedX;
      particle.y -= particle.speedY;

      if (particle.y < -10 || particle.x < -10 || particle.x > width + 10) {
        particle.x = Math.random() * width;
        particle.y = height + 10;
      }

      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fillStyle = `rgba(238, 243, 251, ${particle.alpha})`;
      context.fill();
    });
  };

  const animate = () => {
    context.clearRect(0, 0, width, height);
    drawBackdrop();
    drawParticles();
    requestAnimationFrame(animate);
  };

  resizeCanvas();
  animate();
  window.addEventListener("resize", resizeCanvas);
}
