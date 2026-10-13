const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

const menuToggle = $("#menuToggle");
const navLinks = $("#navLinks");
menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Mở menu" : "Đóng menu");
  navLinks.classList.toggle("open", !isOpen);
});
$$(".nav-links a").forEach(link => link.addEventListener("click", () => {
  navLinks.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Mở menu");
}));

const themeToggle = $("#themeToggle");
themeToggle.addEventListener("click", () => {
  const dark = document.body.classList.toggle("dark");
  themeToggle.textContent = dark ? "☀" : "☾";
  themeToggle.setAttribute("aria-label", dark ? "Bật chế độ sáng" : "Bật chế độ tối");
});

const filterButtons = $$(".filter-btn");
const projectCards = $$(".project-card");
filterButtons.forEach(button => button.addEventListener("click", () => {
  filterButtons.forEach(item => item.classList.toggle("active", item === button));
  const filter = button.dataset.filter;
  projectCards.forEach(card => {
    card.hidden = filter !== "all" && card.dataset.category !== filter;
  });
}));

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
$$(".reveal").forEach(element => revealObserver.observe(element));

$("#year").textContent = new Date().getFullYear();

const form = $("#contactForm");
const fields = {
  name: { input: $("#name"), error: $("#nameError"), validate: value => value.trim().length >= 2, message: "Vui lòng nhập tên có ít nhất 2 ký tự." },
  email: { input: $("#email"), error: $("#emailError"), validate: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()), message: "Vui lòng nhập địa chỉ email hợp lệ." },
  message: { input: $("#message"), error: $("#messageError"), validate: value => value.trim().length >= 10, message: "Lời nhắn cần có ít nhất 10 ký tự." }
};
Object.values(fields).forEach(field => {
  field.input.addEventListener("input", () => {
    field.input.classList.remove("invalid");
    field.error.textContent = "";
    $("#formStatus").textContent = "";
    $("#formStatus").classList.remove("error");
  });
});
form.addEventListener("submit", event => {
  event.preventDefault();
  let valid = true;
  Object.values(fields).forEach(field => {
    const fieldValid = field.validate(field.input.value);
    field.input.classList.toggle("invalid", !fieldValid);
    field.error.textContent = fieldValid ? "" : field.message;
    if (!fieldValid) valid = false;
  });
  const status = $("#formStatus");
  if (!valid) {
    status.textContent = "Bạn hãy kiểm tra lại những mục được đánh dấu nhé.";
    status.classList.add("error");
    Object.values(fields).find(field => !field.validate(field.input.value))?.input.focus();
    return;
  }
  status.classList.remove("error");
  status.textContent = "Thông tin hợp lệ! Đây là bản demo, bạn cần kết nối backend để gửi tin nhắn thật.";
  form.reset();
});

document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');

        if (targetId && targetId.startsWith('#') && targetId.length > 1) {
            e.preventDefault();

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Tùy chỉnh thời gian cuộn (tính bằng ms, ví dụ: 1000ms = 1 giây)
                smoothScrollTo(targetElement, 1000); 
            }
        }
    });
});

function smoothScrollTo(element, duration) {
    const targetPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        
        // Hàm gia tốc Easing (Ease-In-Out Quad) giúp hiệu ứng bắt đầu chậm -> nhanh -> dừng chậm lại
        const progress = Math.min(timeElapsed / duration, 1);
        const ease = progress < 0.5 
            ? 2 * progress * progress 
            : -1 + (4 - 2 * progress) * progress;

        window.scrollTo(0, startPosition + distance * ease);

        if (timeElapsed < duration) {
            requestAnimationFrame(animation);
        }
    }

    requestAnimationFrame(animation);
}