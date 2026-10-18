const $ = (selector, scope = document) => scope.querySelector(selector); const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

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

 // --- HIỆU ỨNG HẠT LẤP LÁNH (TỐI ƯU) ---
const sparklesList = ['✦', '✳', '★', '✧', '•'];
const sparkleColors = ['var(--rose)', 'var(--teal)', '#d5a79b', '#8fa9a5'];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let lastSparkleTime = 0;
const MAX_SPARKLES = 45;

function createSparkle(x, y) {
  if (reduceMotion) return;

  const activeSparkles = document.querySelectorAll('.sparkle');
  if (activeSparkles.length >= MAX_SPARKLES) {
    activeSparkles[0].remove();
  }

  const sparkle = document.createElement('span');
  sparkle.className = 'sparkle';
  sparkle.setAttribute('aria-hidden', 'true');
  sparkle.textContent =
    sparklesList[Math.floor(Math.random() * sparklesList.length)];

  sparkle.style.left = `${x}px`;
  sparkle.style.top = `${y}px`;
  sparkle.style.color =
    sparkleColors[Math.floor(Math.random() * sparkleColors.length)];

  const dx = (Math.random() - 0.5) * 60;
  const dy = (Math.random() - 0.5) * 60 - 20;

  sparkle.style.setProperty('--dx', `${dx}px`);
  sparkle.style.setProperty('--dy', `${dy}px`);
  sparkle.style.setProperty('--dx-mid', `${dx * 0.55}px`);
  sparkle.style.setProperty('--dy-mid', `${dy * 0.55}px`);

  document.body.appendChild(sparkle);
  sparkle.addEventListener('animationend', () => sparkle.remove(), {
    once: true
  });
}

window.addEventListener('mousemove', (e) => {
  const now = performance.now();

  if (now - lastSparkleTime >= 55) {
    createSparkle(e.clientX, e.clientY);
    lastSparkleTime = now;
  }
}, { passive: true });

window.addEventListener('click', (e) => {
  for (let i = 0; i < 6; i++) {
    createSparkle(
      e.clientX + (Math.random() - 0.5) * 18,
      e.clientY + (Math.random() - 0.5) * 18
    );
  }
}, { passive: true });


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
const themeToggle = $("#themeToggle"); if (themeToggle) { themeToggle.addEventListener("click", () => { const dark = document.body.classList.toggle("dark"); themeToggle.textContent = dark ? "☀" : "☾"; themeToggle.setAttribute("aria-label", dark ? "Bật chế độ sáng" : "Bật chế độ tối"); }); }  const filterButtons = $$(".filter-btn");
const projectCards = $$(".project-card"); filterButtons.forEach(button => button.addEventListener("click", () => { filterButtons.forEach(item => item.classList.toggle("active", item === button)); const filter = button.dataset.filter; projectCards.forEach(card => { card.hidden = filter !== "all" && card.dataset.category !== filter; }); }));  const revealObserver = new IntersectionObserver((entries, observer) => { entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add("visible"); observer.unobserve(entry.target); } }); }, { threshold: 0.12 }); $$(".reveal").forEach(element => revealObserver.observe(element));

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
// --- XỬ LÝ THANH GẠCH CHÂN TRƯỢT MENU (ĐÃ FIX LỖI "TRANG ĐẦU" & "LIÊN HỆ") ---
document.addEventListener("DOMContentLoaded", () => {
  const navContainer = document.querySelector("#navLinks");
  const indicator = document.querySelector(".nav-indicator");
  const menuLinks = document.querySelectorAll("#navLinks > a:not(.nav-cta)");

  if (!indicator || menuLinks.length === 0) return;

  // Hàm cập nhật vị trí thanh gạch chân
  function updateIndicator(targetEl) {
    // Nếu không có phần tử được chọn (ví dụ: đang ở Trang đầu #home hoặc Liên hệ #contact), ẩn thanh gạch chân
    if (!targetEl || window.innerWidth <= 700) {
      indicator.style.opacity = "0";
      return;
    }

    const left = targetEl.offsetLeft;
    const width = targetEl.offsetWidth;

    indicator.style.width = `${width}px`;
    indicator.style.transform = `translateX(${left}px)`;
    indicator.style.opacity = "1";
  }

  let currentActive = document.querySelector("#navLinks > a.active");

  // Khởi tạo ban đầu
  setTimeout(() => {
    updateIndicator(currentActive);
  }, 100);

  // 1. XỬ LÝ SỰ KIỆN CLICK MENU
  // Bấm vào các mục menu chính (Giới thiệu, Kỹ năng, Hành trình, Dự án)
  menuLinks.forEach(link => {
    link.addEventListener("click", function () {
      document.querySelectorAll("nav a").forEach(l => l.classList.remove("active"));
      this.classList.add("active");
      currentActive = this;
      updateIndicator(this);
    });
  });

  // Bấm vào Logo Trang Đầu hoặc Nút Liên Hệ
  const otherLinks = document.querySelectorAll("a.brand, a.nav-cta, a[href='#home'], a[href='#top']");
  otherLinks.forEach(link => {
    link.addEventListener("click", () => {
      menuLinks.forEach(l => l.classList.remove("active"));
      currentActive = null;
      updateIndicator(null); // Ẩn gạch chân
    });
  });

  // 2. TÍCH HỢP SCROLLSPY (Cập nhật vị trí khi cuộn trang)
  // Danh sách tất cả các section tương ứng
  const sections = [
    document.querySelector("#home"),
    document.querySelector("#about"),
    document.querySelector("#skills"),
    document.querySelector("#journey"),
    document.querySelector("#projects"),
    document.querySelector("#contact")
  ].filter(Boolean);

  window.addEventListener("scroll", () => {
    if (window.innerWidth <= 700) return;

    let scrollPosition = window.scrollY + 120; // Offset khoảng cách Navbar

    sections.forEach(section => {
      if (
        scrollPosition >= section.offsetTop &&
        scrollPosition < section.offsetTop + section.offsetHeight
      ) {
        const id = section.getAttribute("id");

        // Nếu cuộn về #home hoặc #contact thì bỏ active các nút menu và ẩn gạch chân
        if (id === "home" || id === "contact") {
          menuLinks.forEach(l => l.classList.remove("active"));
          if (currentActive !== null) {
            currentActive = null;
            updateIndicator(null);
          }
        } else {
          // Ngược lại, active nút tương ứng với section đang hiển thị
          const activeLink = document.querySelector(`#navLinks > a[href="#${id}"]`);
          if (activeLink && activeLink !== currentActive) {
            menuLinks.forEach(l => l.classList.remove("active"));
            activeLink.classList.add("active");
            currentActive = activeLink;
            updateIndicator(activeLink);
          }
        }
      }
    });
  }, { passive: true });

  // 3. TỰ ĐỘNG CĂN CHỈNH KHI TĂNG/GIẢM KÍCH THƯỚC CỬA SỔ
  window.addEventListener("resize", () => {
    updateIndicator(currentActive);
  });
});