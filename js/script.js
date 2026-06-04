document.body.style.overflow = "hidden";

setTimeout(() => {
    envScreen.style.display = "none";
    invScreen.classList.add("active");

    document.body.style.overflowY = "auto";

    invScreen.style.opacity = "1";
    initInviteScreen();
}, 100);











/* ═══════════════════════════════════════════
   WEDDING INVITATION — script.js
═══════════════════════════════════════════ */

// ─── Floating Petals ─────────────────────
(function spawnPetals() {
  const container = document.getElementById("petalsContainer");
  if (!container) return;
  const symbols = ["🌸", "🌺", "✿", "❀", "🌼","❤️"];
  for (let i = 0; i < 18; i++) {
    const p = document.createElement("div");
    p.className = "petal";
    p.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    p.style.left = Math.random() * 100 + "vw";
    p.style.fontSize = 10 + Math.random() * 14 + "px";
    p.style.animationDuration = 6 + Math.random() * 3 + "s";
    p.style.animationDelay = Math.random() * 6 + "s";
    container.appendChild(p);
  }
})();


(function spawnHeroHearts() {

    const container = document.getElementById("heroHearts");
    if (!container) return;

    const hearts = ["❤️"];

    for (let i = 0; i < 15; i++) {

        const heart = document.createElement("div");

        heart.className = "hero-heart";
        heart.textContent = hearts[0];

        heart.style.left = Math.random() * 100 + "vw";
        heart.style.fontSize = (12 + Math.random() * 18) + "px";

        heart.style.animationDuration =
            (8 + Math.random() * 8) + "s";

        heart.style.animationDelay =
            Math.random() * 8 + "s";

        container.appendChild(heart);
    }

})();

(function spawnTopHearts(){

    const container = document.getElementById("heroHeartsTop");
    if(!container) return;

    for(let i = 0; i < 10; i++){

        const heart = document.createElement("div");

        heart.className = "hero-heart-top";
        heart.innerHTML = "❤️";

        heart.style.left = Math.random() * 100 + "%";
        heart.style.fontSize = (10 + Math.random() * 12) + "px";
        heart.style.animationDuration = (8 + Math.random() * 6) + "s";
        heart.style.animationDelay = Math.random() * 5 + "s";

        container.appendChild(heart);
    }

})();

// ─── Envelope Open ─────────────────────
let envelopeOpened = false;

function openEnvelope() {
  if (envelopeOpened) return;
  envelopeOpened = true;

  const wrap = document.getElementById("envelopeWrap");
  wrap.classList.add("opening");

  // After animation, transition to invite
  setTimeout(() => {
    const envScreen = document.getElementById("screen-envelope");
    const invScreen = document.getElementById("screen-invite");

    envScreen.classList.add("exit");
    envScreen.classList.remove("active");

    invScreen.style.position = "relative";
    invScreen.style.opacity = "0";
    invScreen.style.pointerEvents = "all";
    invScreen.style.transition = "opacity 0.8s ease";

    setTimeout(() => {
      envScreen.style.display = "none";
      invScreen.classList.add("active");
      invScreen.style.opacity = "1";
      initInviteScreen();
    }, 100);
  }, 1200);
}

// ─── Init Invite Screen ─────────────────
function initInviteScreen() {
  // Try playing music
  playMusic();
  // Start countdown
  startCountdown();
  // Init scratch card
  initScratchCard();
  // Init gallery swipe
  initGallery();
  // Init scroll reveals
  initScrollReveal();
}

// ─── Music ──────────────────────────────
let musicPlaying = false;
const audio = document.getElementById("bgMusic");

function playMusic() {
  if (!audio) return;
  audio.volume = 0.4;
  const promise = audio.play();
  if (promise) {
    promise
      .then(() => {
        musicPlaying = true;
        updateMusicIcon();
      })
      .catch(() => {
        musicPlaying = false;
        updateMusicIcon();
      });
  }
}

function toggleMusic() {
  if (!audio) return;
  if (musicPlaying) {
    audio.pause();
    musicPlaying = false;
  } else {
    audio.play().then(() => {
      musicPlaying = true;
      updateMusicIcon();
    });
  }
  updateMusicIcon();
}

function updateMusicIcon() {
  const btn = document.getElementById("musicToggle");
  const icon = document.getElementById("musicIcon");
  if (!btn || !icon) return;
  icon.textContent = musicPlaying ? "♪" : "♩";
  btn.classList.toggle("muted", !musicPlaying);
}

// ─── Countdown ─────────────────────────
function startCountdown() {
  const target = new Date("2026-06-26T00:00:00+05:30").getTime();

  function tick() {
    const now = Date.now();
    const diff = target - now;
    if (diff <= 0) {
      document.getElementById("cDays").textContent = "00";
      document.getElementById("cHours").textContent = "00";
      document.getElementById("cMins").textContent = "00";
      document.getElementById("cSecs").textContent = "00";
      return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    document.getElementById("cDays").textContent = String(d).padStart(2, "0");
    document.getElementById("cHours").textContent = String(h).padStart(2, "0");
    document.getElementById("cMins").textContent = String(m).padStart(2, "0");
    document.getElementById("cSecs").textContent = String(s).padStart(2, "0");
  }

  tick();
  setInterval(tick, 1000);
}

// ─── Scratch Card ─────────────────────
function initScratchCard() {
  const canvas = document.getElementById("scratchCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const hint = document.getElementById("scratchHint");
  const countdownWrap = document.getElementById("countdownWrap");

  // Scale for retina
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  const W = canvas.offsetWidth || 340;
  const H = canvas.offsetHeight || 90;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  canvas.style.width = W + "px";
  canvas.style.height = H + "px";
  ctx.scale(dpr, dpr);

  // Fill scratch layer
  drawScratchLayer(ctx, W, H);

  let isDrawing = false;
  let scratchedPixels = 0;
  let totalPixels = W * H;
  let revealTriggered = false;
  let totalScratch = 0;

  function drawScratchLayer(ctx, w, h) {
    // Background gradient for scratch surface
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, "#9CB59A");
    grad.addColorStop(0.5, "#7A9E7A");
    grad.addColorStop(1, "#8FAA8C");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Pattern texture
    ctx.fillStyle = "rgba(255,255,255,0.05)";
    for (let i = 0; i < 40; i++) {
      ctx.beginPath();
      ctx.arc(
        Math.random() * w,
        Math.random() * h,
        Math.random() * 8 + 2,
        0,
        Math.PI * 2,
      );
      ctx.fill();
    }

    // Instruction text
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.font = "600 15px Lato, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("✦  Scratch to Reveal  ✦", w / 2, h / 2);
  }

  function getPos(e) {
    const r = canvas.getBoundingClientRect();
    if (e.touches) {
      return {
        x: e.touches[0].clientX - r.left,
        y: e.touches[0].clientY - r.top,
      };
    }
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  function scratch(e) {
    if (!isDrawing) return;
    e.preventDefault();
    const pos = getPos(e);
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 28, 0, Math.PI * 2);
    ctx.fill();

    // Check coverage
    totalScratch += Math.PI * 28 * 28;
    const pct = Math.min(totalScratch / totalPixels, 1);

    if (pct > 0.4 && !revealTriggered) {
      revealTriggered = true;
      revealComplete();
    }
  }

  function revealComplete() {
    // Animate canvas out
    canvas.style.transition = "opacity 0.8s ease";
    canvas.style.opacity = "0";
    setTimeout(() => {
      canvas.style.display = "none";
    }, 800);

    if (hint) hint.classList.add("hidden");

    // Show countdown
    if (countdownWrap) {
      setTimeout(() => {
        countdownWrap.classList.add("visible");
      }, 400);
    }

    // Show Event Schedule after scratch
    const scheduleSection = document.getElementById("scheduleSection");

    if (scheduleSection) {
      setTimeout(() => {
        scheduleSection.style.display = "block";

        // Optional smooth animation
        scheduleSection.style.opacity = "0";
        scheduleSection.style.transform = "translateY(40px)";

        setTimeout(() => {
          scheduleSection.style.transition =
            "opacity 0.8s ease, transform 0.8s ease";
          scheduleSection.style.opacity = "1";
          scheduleSection.style.transform = "translateY(0)";
        }, 50);
      }, 600);
    }

    // Confetti burst
    triggerConfetti();
  }

  canvas.addEventListener("mousedown", (e) => {
    isDrawing = true;
    scratch(e);
  });
  canvas.addEventListener("mousemove", scratch);
  canvas.addEventListener("mouseup", () => {
    isDrawing = false;
  });
  canvas.addEventListener("mouseleave", () => {
    isDrawing = false;
  });
  canvas.addEventListener(
    "touchstart",
    (e) => {
      isDrawing = true;
      scratch(e);
    },
    { passive: false },
  );
  canvas.addEventListener("touchmove", scratch, { passive: false });
  canvas.addEventListener("touchend", () => {
    isDrawing = false;
  });
}

// ─── Confetti ──────────────────────────
function triggerConfetti() {
  const container = document.body;
  const colors = ["#D4A843", "#C97B8C", "#BAC7B6", "#E8B4B8", "#8FA38A"];
  const pieces = 60;

  for (let i = 0; i < pieces; i++) {
    const c = document.createElement("div");
    c.style.cssText = `
      position: fixed;
      top: ${30 + Math.random() * 30}%;
      left: ${Math.random() * 100}%;
      width: ${6 + Math.random() * 8}px;
      height: ${6 + Math.random() * 8}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      border-radius: ${Math.random() > 0.5 ? "50%" : "2px"};
      z-index: 999;
      pointer-events: none;
      animation: confettiFall ${1.5 + Math.random() * 2}s ease ${Math.random() * 0.5}s forwards;
    `;
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 3000);
  }

  // Inject confetti keyframe once
  if (!document.getElementById("confettiStyle")) {
    const s = document.createElement("style");
    s.id = "confettiStyle";
    s.textContent = `@keyframes confettiFall {
      0% { transform: translateY(0) rotate(0deg); opacity:1; }
      100% { transform: translateY(300px) rotate(720deg); opacity:0; }
    }`;
    document.head.appendChild(s);
  }
}

// ─── Gallery Swipe ─────────────────────
function initGallery() {
  const track = document.getElementById("galleryTrack");
  const dots = document.querySelectorAll(".gdot");
  if (!track) return;

  let current = 0;
  let startX = 0;
  let isDragging = false;
  const total = track.children.length;

  function goTo(idx) {
    current = (idx + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle("active", i === current));
  }

  // Dot clicks
  dots.forEach((d, i) => d.addEventListener("click", () => goTo(i)));

  // Touch swipe
  track.addEventListener(
    "touchstart",
    (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
    },
    { passive: true },
  );
  track.addEventListener("touchend", (e) => {
    if (!isDragging) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) dx < 0 ? goTo(current + 1) : goTo(current - 1);
    isDragging = false;
  });

  // Auto-advance
  setInterval(() => goTo(current + 1), 4000);
}

// ─── Scroll Reveal ─────────────────────
function initScrollReveal() {
  const sections = document.querySelectorAll(
    ".hero-section, .scratch-section, .schedule-section, .noble-section, .families-section, .venue-section, .gallery-section, .footer-section",
  );

  // Add reveal class
  sections.forEach((el) => el.classList.add("scroll-reveal"));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 },
  );

  sections.forEach((el) => observer.observe(el));
}

// ─── Keyboard shortcut (dev) ─────────────
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !envelopeOpened) openEnvelope();
});
