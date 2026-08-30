const houseGallery = [
  { src: "house-01.jpg", title: "بيت التحفيات — صورة 01" },
  { src: "house-02.jpg", title: "بيت التحفيات — صورة 02" },
  { src: "house-03.jpg", title: "بيت التحفيات — صورة 03" },
  { src: "house-05.jpg", title: "بيت التحفيات — صورة 05" },
  { src: "house-06.jpg", title: "بيت التحفيات — صورة 06" },
  { src: "house-09.jpg", title: "بيت التحفيات — صورة 09" },
  { src: "house-10.jpg", title: "بيت التحفيات — صورة 10" }
];

const documentedEvents = [
  {
    title: "لحظة موثقة من بيت التحفيات",
    category: "YouTube Shorts",
    url: "https://youtube.com/shorts/gicex_a8_eo?si=MqRHuE8X40sYGmsu",
    thumbnail: "assets/events/event-01.jpg"
  },
  {
    title: "زيارة موثقة داخل البيت",
    category: "YouTube Shorts",
    url: "https://youtube.com/shorts/dfSzxqlMooA?si=zuL3CPJHv96HqSkw",
    thumbnail: "assets/events/event-02.jpg"
  },
  {
    title: "توثيق من بيت التحفيات",
    category: "YouTube",
    url: "https://youtu.be/CE9_DkXkTdg?si=WILZui8RJ2jN2DoD",
    thumbnail: "assets/events/event-03.jpg"
  },
  {
    title: "من أجواء بيت التحفيات",
    category: "YouTube",
    url: "https://youtu.be/W8e8TPJkNHQ?si=s9IunWGu3zZ9hv1s",
    thumbnail: "assets/events/event-04.jpg"
  },
  {
    title: "فيديو كليب صُوّر داخل بيت التحفيات",
    category: "Music Video",
    url: "https://youtu.be/za6ZiWYhEiM?si=G6Eik3mFMEmE1gKp",
    thumbnail: "assets/events/event-05.jpg"
  },
  {
    title: "فيديو كليب من داخل بيت التحفيات",
    category: "Music Video",
    url: "https://youtu.be/Fcsg74uoJA0?si=UOFEd6bFmpVgWns4",
    thumbnail: "assets/events/event-06.jpg"
  }
];

const modalItems = [];
let activeModalIndex = 0;
let touchStartX = 0;

document.body.classList.add("motion-ready");

const sections = [...document.querySelectorAll("main .section")];
const sideLinks = [...document.querySelectorAll(".side-nav a")];
const navLinks = [...document.querySelectorAll(".main-nav a")];
const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("visible");
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.14 });

sections.forEach((section) => revealObserver.observe(section));

const activeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const selector = `#${entry.target.id}`;
    [...sideLinks, ...navLinks].forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === selector);
    });
  });
}, {
  rootMargin: "-38% 0px -50% 0px",
  threshold: 0.01
});

sections.forEach((section) => activeObserver.observe(section));

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const href = link.getAttribute("href");
    if (!href || href === "#") {
      event.preventDefault();
      return;
    }

    const target = document.querySelector(href);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    closeMobileNav();
  });
});

menuToggle?.addEventListener("click", () => {
  const isOpen = mainNav?.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
});

function closeMobileNav() {
  mainNav?.classList.remove("is-open");
  menuToggle?.setAttribute("aria-expanded", "false");
}

function applyImageIfExists(element, src) {
  const image = new Image();
  image.onload = () => {
    element.classList.add("has-image");
    element.style.setProperty("--image", `url("${src}")`);
    if (!element.matches("[data-image]")) {
      element.style.backgroundImage = `url("${src}")`;
    }
  };
  image.onerror = () => element.classList.remove("has-image");
  image.src = src;
}

document.querySelectorAll("[data-image]").forEach((element) => {
  applyImageIfExists(element, element.dataset.image);
});

function renderGallery(containerId, items, extraClass = "") {
  const container = document.getElementById(containerId);
  if (!container) return;

  items.forEach((item) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `gallery-button ${extraClass}`.trim();
    button.dataset.caption = item.title;
    button.textContent = item.src;
    button.setAttribute("aria-label", item.title);
    applyImageIfExists(button, item.src);

    const modalIndex = modalItems.push(item) - 1;
    button.addEventListener("click", () => openModal(modalIndex));
    container.appendChild(button);
  });
}

function renderCarousel(containerId, items) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const track = document.createElement("div");
  track.className = "slider-track";
  const loopItems = [...items, ...items];

  loopItems.forEach((item) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "gallery-button slider-card";
    button.dataset.caption = item.title;
    button.textContent = item.src;
    button.setAttribute("aria-label", item.title);
    applyImageIfExists(button, item.src);

    const modalIndex = modalItems.push(item) - 1;
    button.addEventListener("click", () => openModal(modalIndex));
    track.appendChild(button);
  });

  container.appendChild(track);
}
function renderDocumentedEvents() {
  const container = document.getElementById("documentedEvents");
  if (!container) return;

  if (!documentedEvents.length) {
    const empty = document.createElement("div");
    empty.className = "event-empty";
    empty.textContent = "لا توجد روابط توثيق مضافة حالياً.";
    container.appendChild(empty);
    return;
  }

  documentedEvents.forEach((eventItem) => {
    const card = document.createElement("article");
    card.className = "event-card text-only";

    const category = document.createElement("small");
    category.textContent = eventItem.category || "DOCUMENTED MOMENT";

    const title = document.createElement("h3");
    title.textContent = eventItem.title || "لحظة موثقة";

    const link = document.createElement("a");
    link.className = "button primary";
    link.href = eventItem.url || "#";
    link.target = "_blank";
    link.rel = "noopener";
    link.textContent = "مشاهدة التوثيق ↗";

    card.append(category, title, link);
    container.appendChild(card);
  });
}

const modal = document.querySelector(".gallery-modal");
const modalImage = modal?.querySelector("img");
const modalCaption = modal?.querySelector("figcaption");

function openModal(index) {
  activeModalIndex = index;
  updateModal();
  if (typeof modal?.showModal === "function") modal.showModal();
}

function updateModal() {
  const item = modalItems[activeModalIndex];
  if (!item || !modalImage || !modalCaption) return;

  const probe = new Image();
  probe.onload = () => {
    modalImage.hidden = false;
    modalImage.src = item.src;
    modalCaption.textContent = item.title;
  };
  probe.onerror = () => {
    modalImage.hidden = true;
    modalImage.removeAttribute("src");
    modalCaption.textContent = `لم تتم إضافة الصورة بعد: ${item.src}`;
  };
  probe.src = item.src;
}

function showNext() {
  activeModalIndex = (activeModalIndex + 1) % modalItems.length;
  updateModal();
}

function showPrevious() {
  activeModalIndex = (activeModalIndex - 1 + modalItems.length) % modalItems.length;
  updateModal();
}

document.querySelector(".modal-close")?.addEventListener("click", () => modal?.close());
document.querySelector(".modal-arrow.next")?.addEventListener("click", showNext);
document.querySelector(".modal-arrow.prev")?.addEventListener("click", showPrevious);

modal?.addEventListener("click", (event) => {
  if (event.target === modal) modal.close();
});

modal?.addEventListener("touchstart", (event) => {
  touchStartX = event.changedTouches[0].clientX;
}, { passive: true });

modal?.addEventListener("touchend", (event) => {
  const deltaX = event.changedTouches[0].clientX - touchStartX;
  if (Math.abs(deltaX) < 48) return;
  if (deltaX > 0) showNext();
  else showPrevious();
}, { passive: true });

document.addEventListener("keydown", (event) => {
  if (!modal?.open) return;
  if (event.key === "Escape") modal.close();
  if (event.key === "ArrowRight") showNext();
  if (event.key === "ArrowLeft") showPrevious();
});

renderCarousel("gardenGallery", houseGallery);
renderDocumentedEvents();

