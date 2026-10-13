const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

const menuToggle = $("#menuToggle");
const navLinks = $("#navLinks");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Mở menu" : "Đóng menu");
    navLinks.classList.toggle("open", !isOpen);
  });
}

// --- HÀM CUỘN MƯỢT TỐI ƯU CỰC ĐẠI (ĐÃ FIX KHỰNG) ---
function smoothScrollTo(target, duration = 1000, offset = 70) {
  const startPosition = window.pageYOffset || document.documentElement.scrollTop;
  
  let targetPosition = 0;
  if (typeof target === "number") {
    targetPosition = target;
  } else if (target instanceof HTMLElement) {
    targetPosition = target.getBoundingClientRect().top + startPosition - offset;
  } else {
    return;
  }

  const distance = targetPosition - startPosition;
  let startTime = null;

  // Hàm gia tốc Ease-In-Out Quad chuẩn không bị đứt gãy ở mốc 0.5
  function easeInOutQuad(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  }

  function animation(currentTime) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;

    if (timeElapsed < duration) {
      const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      requestAnimationFrame(animation);
    } else {
      // Đảm bảo dừng chính xác 100% tại tọa độ đích
      window.scrollTo(0, targetPosition);
    }
  }

  requestAnimationFrame(animation);
}

// --- SỰ KIỆN CLICK NAV LINKS ---
$$("nav a[href^='#']").forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    const targetId = this.getAttribute("href");

    if (targetId && targetId !== "#") {
      const targetElement = $(targetId);
      if (targetElement) {
        e.preventDefault();

        // Đóng mobile menu nếu đang mở
        if (navLinks && menuToggle) {
          navLinks.classList.remove("open");
          menuToggle.setAttribute("aria-expanded", "false");
          menuToggle.setAttribute("aria-label", "Mở menu");
        }

        // Gọi hàm cuộn mượt (Thời gian 1000ms, trừ bớt 70px chiều cao Navbar nếu có)
        smoothScrollTo(targetElement, 1000, 70);
      }
    }
  });
});

// --- CÁC CHỨC NĂNG KHÁC GIỮ NGUYÊN ---
const themeToggle = $("#themeToggle");
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const dark = document.body.classList.toggle("dark");
    themeToggle.textContent = dark ? "☀" : "☾";
    themeToggle.setAttribute("aria-label", dark ? "Bật chế độ sáng" : "Bật chế độ tối");
  });
}

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

const yearEl = $("#year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

const form = $("#contactForm");
if (form) {
  const fields = {
    name: { input: $("#name"), error: $("#nameError"), validate: value => value.trim().length >= 2, message: "Vui lòng nhập tên có ít nhất 2 ký tự." },
    email: { input: $("#email"), error: $("#emailError"), validate: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()), message: "Vui lòng nhập địa chỉ email hợp lệ." },
    message: { input: $("#message"), error: $("#messageError"), validate: value => value.trim().length >= 10, message: "Lời nhắn cần có ít nhất 10 ký tự." }
  };

  Object.values(fields).forEach(field => {
    if (!field.input) return;
    field.input.addEventListener("input", () => {
      field.input.classList.remove("invalid");
      if (field.error) field.error.textContent = "";
      const status = $("#formStatus");
      if (status) {
        status.textContent = "";
        status.classList.remove("error");
      }
    });
  });

  form.addEventListener("submit", event => {
    event.preventDefault();
    let valid = true;
    Object.values(fields).forEach(field => {
      if (!field.input) return;
      const fieldValid = field.validate(field.input.value);
      field.input.classList.toggle("invalid", !fieldValid);
      if (field.error) field.error.textContent = fieldValid ? "" : field.message;
      if (!fieldValid) valid = false;
    });

    const status = $("#formStatus");
    if (!valid) {
      if (status) {
        status.textContent = "Bạn hãy kiểm tra lại những mục được đánh dấu nhé.";
        status.classList.add("error");
      }
      Object.values(fields).find(field => field.input && !field.validate(field.input.value))?.input.focus();
      return;
    }

    if (status) {
      status.classList.remove("error");
      status.textContent = "Thông tin hợp lệ! Đây là bản demo, bạn cần kết nối backend để gửi tin nhắn thật.";
    }
    form.reset();
  });
}