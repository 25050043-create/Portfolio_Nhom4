// Menu mobile
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const navItems = document.querySelectorAll(".nav-link");

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Đóng menu" : "Mở menu");
});

navItems.forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

// Hiệu ứng chữ thay đổi ở trang chủ
const typingText = document.getElementById("typingText");
const phrases = ["sinh viên IT", "người yêu công nghệ", "người thích khám phá"];
let phraseIndex = 0;
let charIndex = 0;
let deleting = false;

function typeEffect() {
  const current = phrases[phraseIndex];
  typingText.textContent = current.substring(0, charIndex);
  if (!deleting && charIndex < current.length) {
    charIndex++;
    setTimeout(typeEffect, 95);
  } else if (deleting && charIndex > 0) {
    charIndex--;
    setTimeout(typeEffect, 45);
  } else {
    deleting = !deleting;
    if (!deleting) phraseIndex = (phraseIndex + 1) % phrases.length;
    setTimeout(typeEffect, 850);
  }
}
typeEffect();

// Hiện nội dung khi cuộn đến
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

// Đánh dấu mục menu đang xem và nút lên đầu trang
const sections = document.querySelectorAll("main section[id]");
const toTop = document.getElementById("toTop");

window.addEventListener("scroll", () => {
  let currentId = "home";
  sections.forEach((section) => {
    if (window.scrollY >= section.offsetTop - 160) currentId = section.id;
  });

  navItems.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${currentId}`);
  });

  toTop.classList.toggle("visible", window.scrollY > 500);
});

toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

// Form demo: mở ứng dụng email mặc định, không tự gửi dữ liệu lên máy chủ
const contactForm = document.getElementById("contactForm");
const formNote = document.getElementById("formNote");

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = document.getElementById("visitorName").value.trim();
  const email = document.getElementById("visitorEmail").value.trim();
  const message = document.getElementById("visitorMessage").value.trim();

  const subject = encodeURIComponent(`Lời nhắn từ ${name}`);
  const body = encodeURIComponent(`Xin chào Kiều Việt Đức,\n\n${message}\n\nNgười gửi: ${name}\nEmail: ${email}`);
  window.location.href = `mailto:your.email@example.com?subject=${subject}&body=${body}`;
  formNote.textContent = "Đã mở ứng dụng email. Hãy thay địa chỉ email mẫu trong mã nguồn bằng email thật của bạn.";
});

// Năm hiện tại ở chân trang
document.getElementById("year").textContent = new Date().getFullYear();
