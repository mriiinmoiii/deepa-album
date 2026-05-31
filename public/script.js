/* ============================================================
   For Deepa — Memory Album
   All content lives in the CONFIG block below. Edit freely.
   ============================================================ */

const CONFIG = {
  // ---- Timeline memories (Chapter 1) ----
  timeline: [
    { date: "RED ROSE ",  title: "🌹",       img: "/uploads/photos/671061353_18312172081273272_4169391580375762519_n.jpg", text: "Ufffffffffffffffffff" },
    { date: "CHERRY BLOSSOM",  title: "🌸",     img: "/uploads/photos/15.jpg", text: "o maaaaaaa" },
    { date: "MARIGOLD", title: "🏵️",       img: "/uploads/photos/659842964_18310308466273272_6982085363218381777_n.jpg", text: "I am dead!!!!" },
    { date: "RED HAIR BADDIE", title: "🍷", img: "/uploads/photos/11.jpg", text: "Hehehehe" },
    { date: "SARASWATI MAA",    title: "🪕🦢",   img: "/uploads/photos/476099556_18258571549273272_8517204191389604999_n.jpg", text: "Raddhee Radheee" },
    { date: "THE KHUPAAAAA",         title: "✿",     img: "/uploads/photos/31.jpg", text: "Insallah" },
  ],

  // ---- Gallery (Chapter 2) ----
  // Drop files into /uploads/photos/ and list them here.
  // To scale to 100+, just keep adding entries. Categories optional.
  // Tip: use the included generator below to auto-list 1..N files.
  galleryCategories: ["All", "Trips", "Favorites"],
gallery: [], // required for lightbox
  // ---- Reasons (Chapter 4) ----
  reasons: [
    { title: "Your Smile",     text: "It rewrites my whole day in a single second." },
    { title: "Your Eyes",  text: "Your eyes = my favorite distraction." },
    { title: "Your Red Hairs",     text: "That red hair? Instant heart thief" },
    { title: "Your short Height", text: "Proof that cute things come in small sizes 😌" },
    { title: "Your Crazy Side", text: "Wild, brilliant, unfiltered — and so unmistakably you." },
  ],

  // ---- Secret letter (Chapter 5) ----
  letter: `I LOVEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE YOUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU

— Mrinnn.`,
};
/* ============================================================
   LOAD GALLERY FROM BACKEND
============================================================ */
async function loadGallery() {
  const grid = document.getElementById("masonry");

  if (!grid) {
    console.error("Masonry div not found");
    return;
  }

  try {
    const response = await fetch("/api/gallery");

    if (!response.ok) {
      throw new Error("Failed to fetch gallery");
    }

    const photos = await response.json();

    // save to CONFIG for lightbox
    CONFIG.gallery = photos;

    grid.innerHTML = "";

    photos.forEach((photo, index) => {
      const figure = document.createElement("figure");
      figure.className = "tile";

      figure.innerHTML = `
        <img
          src="${photo.src}"
          alt="Memory ${index + 1}"
          loading="lazy"
          decoding="async"
          style="width:100%; border-radius:16px; cursor:pointer;"
        />
      `;

      // lightbox click
      figure.addEventListener("click", () => {
        Lightbox.open(index);
      });

      grid.appendChild(figure);
    });
  } catch (err) {
    console.error("Gallery failed:", err);
  }
}



/* ============================================================
   UTILITIES
   ============================================================ */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const PLACEHOLDER = "./placeholder.svg";
const onImgErr = (img) => { img.onerror = null; img.src = PLACEHOLDER; };

/* ============================================================
   NAV — scroll spy + mobile drawer + glass on scroll
   ============================================================ */
(function Nav() {
  const nav = $("#nav");
  const toggle = $("#navToggle");
  const links = $$(".nav__link");

  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open);
  });
  links.forEach((l) => l.addEventListener("click", () => nav.classList.remove("is-open")));

  let ticking = false;
  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      nav.classList.toggle("is-scrolled", window.scrollY > 60);
      // scroll spy
      const y = window.scrollY + window.innerHeight * 0.35;
      let current = "home";
      $$("section[id]").forEach((sec) => {
        if (sec.offsetTop <= y) current = sec.id;
      });
      links.forEach((l) => l.classList.toggle("is-active", l.getAttribute("href") === `#${current}`));
      ticking = false;
    });
  }, { passive: true });
})();

/* ============================================================
   HERO — try to load video, otherwise stay on image
   ============================================================ */
(function Hero() {
  const video = $("#heroVideo");
  const img = $("#heroImg");
  // Try the video file; if it fails, hide it (image stays)
  const test = document.createElement("video");
  test.src = "videos/hero.mp4";
  test.addEventListener("loadeddata", () => {
    video.src = "videos/hero.mp4";
    video.classList.add("is-active");
    img.style.display = "none";
  });
  test.addEventListener("error", () => { /* keep image */ });
  // Image fallback
  img.addEventListener("error", () => onImgErr(img));
})();

/* ============================================================
   PARTICLES — soft floating dots on canvas
   ============================================================ */
function particles(canvas, opts = {}) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const ctx = canvas.getContext("2d");
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let w, h, parts;
  const count = opts.count || 60;
  const color = opts.color || "rgba(245,184,196,";

  function resize() {
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.scale(dpr, dpr);
    parts = Array.from({ length: count }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      r: Math.random() * 1.8 + 0.4,
      vx: (Math.random() - 0.5) * 0.15,
      vy: -Math.random() * 0.25 - 0.05,
      a: Math.random() * 0.5 + 0.2,
    }));
  }
  let raf;
  function tick() {
    ctx.clearRect(0, 0, w, h);
    parts.forEach((p) => {
      p.x += p.vx; p.y += p.vy;
      if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;
      ctx.fillStyle = color + p.a + ")";
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
    });
    raf = requestAnimationFrame(tick);
  }
  const ro = new ResizeObserver(resize); ro.observe(canvas);
  resize(); tick();
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else tick();
  });
}
particles($("#heroParticles"), { count: 80 });
particles($("#endParticles"), { count: 50, color: "rgba(217,180,138," });

/* ============================================================
   SCROLL REVEAL
   ============================================================ */
(function Reveal() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("is-in");
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  $$(".reveal").forEach((el) => io.observe(el));
  // expose so we can attach to dynamically added nodes
  window.__revealObserver = io;
})();

/* ============================================================
   TIMELINE
   ============================================================ */
(function Timeline() {
  const rail = $("#timelineRail");
  rail.innerHTML = CONFIG.timeline.map((m, i) => `
    <div class="tl-item" data-i="${i}">
      <div class="tl-card">
        <div class="tl-card__img"><img src="${m.img}" alt="${m.title}" loading="lazy" onerror="this.onerror=null;this.src='${PLACEHOLDER}'"/></div>
        <div class="tl-card__body">
          <div class="tl-card__date">${m.date}</div>
          <h3 class="tl-card__title">${m.title}</h3>
          <p class="tl-card__text">${m.text}</p>
        </div>
      </div>
    </div>
  `).join("");

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
    });
  }, { threshold: 0.18 });
  $$(".tl-item", rail).forEach((el) => io.observe(el));
})();

/* ============================================================
   GALLERY + LIGHTBOX
   ============================================================ */
  /* ============================================================
   GALLERY
============================================================ */
/* ============================================================
   GALLERY
============================================================ */
/* ============================================================
   GALLERY
============================================================ */

window.addEventListener("DOMContentLoaded", async () => {

  const grid = document.getElementById("masonry");

  if (!grid) {
    console.error("Masonry container not found");
    return;
  }

  try {

    const response = await fetch("/api/gallery");

    const photos = (await response.json()).slice(0, 60);

    console.log("Gallery photos:", photos);

    if (!photos.length) {
      grid.innerHTML = "<h2>No photos found</h2>";
      return;
    }

    grid.innerHTML = photos.map((photo, index) => `
      <figure class="tile reveal">
        <img
          src="${photo.src}"
          alt="Memory ${index + 1}"
          loading="lazy"
          style="width:100%;border-radius:16px;"
        />
      </figure>
    `).join("");

    // reveal animation support
    if (window.__revealObserver) {
      document.querySelectorAll(".reveal")
        .forEach(el => window.__revealObserver.observe(el));
    }

  } catch (err) {
    console.error("Gallery error:", err);
  }

});


const Lightbox = (function () {
  const box = $("#lightbox");
  const img = $("#lbImg");
  const cap = $("#lbCap");
  const count = $("#lbCount");
  const closeBtn = $("#lbClose");
  const prevBtn = $("#lbPrev");
  const nextBtn = $("#lbNext");
  const playBtn = $("#lbPlay");
  let index = 0, list = [], timer = null;

  function open(i) {
    list = CONFIG.gallery;
    index = i;
    show();
    box.classList.add("is-open");
    box.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function close() {
    box.classList.remove("is-open");
    box.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    stopSlideshow();
  }
  function show() {
    box.classList.add("is-fading");
    setTimeout(() => {
      img.src = list[index].src;
      img.onerror = () => onImgErr(img);
      cap.textContent = list[index].cap || "";
      count.textContent = `${String(index + 1).padStart(2, "0")} / ${String(list.length).padStart(2, "0")}`;
      box.classList.remove("is-fading");
    }, 200);
  }
  function next() { index = (index + 1) % list.length; show(); }
  function prev() { index = (index - 1 + list.length) % list.length; show(); }
  function startSlideshow() {
    playBtn.textContent = "■ Stop";
    timer = setInterval(next, 3500);
  }
  function stopSlideshow() {
    if (timer) { clearInterval(timer); timer = null; }
    playBtn.textContent = "▶ Slideshow";
  }
  playBtn.addEventListener("click", () => (timer ? stopSlideshow() : startSlideshow()));
  nextBtn.addEventListener("click", next);
  prevBtn.addEventListener("click", prev);
  closeBtn.addEventListener("click", close);
  box.addEventListener("click", (e) => { if (e.target === box) close(); });
  document.addEventListener("keydown", (e) => {
    if (!box.classList.contains("is-open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
  });
  return { open };
})();

/* ============================================================
   VIDEOS
   ============================================================ */
/* ============================================================
   VIDEOS
============================================================ */

window.addEventListener("DOMContentLoaded", async () => {

  const grid = document.getElementById("videosGrid");

  if (!grid) {
    console.error("videosGrid not found");
    return;
  }

  try {

    const response = await fetch("/api/videos");
    const videos = await response.json();

    console.log("Videos loaded:", videos);

    if (!videos.length) {
      grid.innerHTML = `
        <h2 style="text-align:center;">
          No videos found
        </h2>
      `;
      return;
    }

    grid.innerHTML = videos.map((video, index) => `
      <div class="vcard" data-video="${video.src}">
        
       <img
  src="${video.poster}"
  alt="thumbnail"
  style="
    width:100%;
    border-radius:20px;
    cursor:pointer;
  "
/>

        <div class="vcard__overlay">
          <div class="vcard__play">▶</div>
          <div class="vcard__title">
            Memory ${index + 1}
          </div>
        </div>

      </div>
    `).join("");

    // Modal player
    const modal = document.getElementById("vmodal");
    const player = document.getElementById("vmVideo");
    const closeBtn = document.getElementById("vmClose");

    document.querySelectorAll(".vcard")
      .forEach(card => {

      card.addEventListener("click", () => {

        const src = card.dataset.video;

        player.src = src;

        modal.classList.add("is-open");
        modal.setAttribute("aria-hidden", "false");

        document.body.style.overflow = "hidden";

        player.play().catch(() => {});
      });
    });

    closeBtn.addEventListener("click", () => {

      modal.classList.remove("is-open");

      modal.setAttribute("aria-hidden", "true");

      document.body.style.overflow = "";

      player.pause();
      player.src = "";
    });

  } catch (err) {
    console.error("Video loading failed:", err);
  }

});
/* ============================================================
   REASONS
   ============================================================ */
(function Reasons() {
  const grid = $("#reasonsGrid");
  grid.innerHTML = CONFIG.reasons.map((r, i) => `
    <div class="rcard" style="transition-delay: ${i * 80}ms">
      <div class="rcard__num">No. ${String(i + 1).padStart(2, "0")}</div>
      <h3 class="rcard__title">${r.title}</h3>
      <p class="rcard__text">${r.text}</p>
    </div>
  `).join("");
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
    });
  }, { threshold: 0.15 });
  $$(".rcard", grid).forEach((el) => io.observe(el));

  // Subtle tilt on hover (desktop only)
  if (matchMedia("(hover: hover)").matches) {
    $$(".rcard", grid).forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `translateY(-6px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
      });
      card.addEventListener("mouseleave", () => { card.style.transform = ""; });
    });
  }
})();

/* ============================================================
   LETTER — typewriter
   ============================================================ */
(function Letter() {
  const openBtn = $("#openLetter");
  const closeBtn = $("#letterClose");
  const modal = $("#letterModal");
  const paper = modal.querySelector(".letter-paper");
  const text = $("#letterText");
  let typing = null;

  function open() {
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    text.textContent = "";
    paper.classList.remove("is-done");
    const content = CONFIG.letter;
    let i = 0;
    if (typing) clearInterval(typing);
    typing = setInterval(() => {
      text.textContent = content.slice(0, i++);
      if (i > content.length) {
        clearInterval(typing); typing = null;
        paper.classList.add("is-done");
      }
    }, 22);
  }
  function close() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (typing) { clearInterval(typing); typing = null; }
  }
  openBtn.addEventListener("click", open);
  closeBtn.addEventListener("click", close);
  modal.addEventListener("click", (e) => { if (e.target === modal) close(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && modal.classList.contains("is-open")) close(); });
})();

/* ============================================================
   MUSIC TOGGLE
   ============================================================ */
(function Music() {
  const btn = $("#musicToggle");
  const audio = $("#bgm");
  audio.volume = 0.35;
  btn.addEventListener("click", () => {
    if (audio.paused) {
      audio.play().then(() => btn.classList.add("is-playing")).catch(() => {});
    } else {
      audio.pause(); btn.classList.remove("is-playing");
    }
  });
})();