// 1. Chức năng Mobile Menu (Bật/tắt menu trên điện thoại)
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');

menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// 2. Chức năng Dark / Light Mode Toggle
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

themeToggle.addEventListener('click', () => {
    body.classList.toggle('light-mode');
    const icon = themeToggle.querySelector('i');
    if (body.classList.contains('light-mode')) {
        icon.classList.replace('fa-moon', 'fa-sun');
    } else {
        icon.classList.replace('fa-sun', 'fa-moon');
    }
});

// 3. Chức năng Scroll-to-top (Nút cuộn lên đầu trang)
const scrollTopBtn = document.getElementById('scrollTopBtn');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollTopBtn.style.display = 'flex';
    } else {
        scrollTopBtn.style.display = 'none';
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// 4. Kiểm tra dữ liệu Form Liên hệ (Form Validation bằng JavaScript)
const contactForm = document.getElementById('contactForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');

const nameError = document.getElementById('nameError');
const emailError = document.getElementById('emailError');
const messageError = document.getElementById('messageError');
const successMsg = document.getElementById('successMsg');

contactForm.addEventListener('submit', function(e) {
    e.preventDefault(); // Ngăn form gửi mặc định để kiểm tra lỗi
    let isValid = true;

    // Reset thông báo lỗi
    nameError.textContent = '';
    emailError.textContent = '';
    messageError.textContent = '';
    successMsg.textContent = '';

    // Kiểm tra tên
    if (nameInput.value.trim() === '') {
        nameError.textContent = 'Vui lòng nhập họ tên của bạn.';
        isValid = false;
    }

    // Kiểm tra email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailInput.value.trim() === '') {
        emailError.textContent = 'Vui lòng nhập email.';
        isValid = false;
    } else if (!emailRegex.test(emailInput.value.trim())) {
        emailError.textContent = 'Email không hợp lệ.';
        isValid = false;
    }

    // Kiểm tra tin nhắn
    if (messageInput.value.trim() === '') {
        messageError.textContent = 'Vui lòng nhập nội dung tin nhắn.';
        isValid = false;
    }

    // Nếu hợp lệ
    if (isValid) {
        successMsg.textContent = 'Cảm ơn bạn! Tin nhắn đã được gửi thành công.';
        contactForm.reset();
        setTimeout(() => {
            successMsg.textContent = '';
        }, 4000);
    }
});
// 5. Hiệu ứng chạy thanh tiến độ (Progress Bar Animation) when scrolling to section
const skillSection = document.getElementById('skills');
const progressBars = document.querySelectorAll('.progress');
let animated = false;

window.addEventListener('scroll', () => {
    const sectionPos = skillSection.getBoundingClientRect().top;
    const screenHeight = window.innerHeight;

    if (sectionPos < screenHeight - 100 && !animated) {
        progressBars.forEach(bar => {
            // Lấy giá trị width inline đã đặt sẵn trong HTML (ví dụ: style="width: 90%;")
            const targetWidth = bar.style.width;
            bar.style.width = '0%'; // Reset về 0 trước khi chạy
            setTimeout(() => {
                bar.style.width = targetWidth; // Chạy về đúng giá trị
            }, 100);
        });
        animated = true; // Chỉ chạy 1 lần duy nhất khi cuộn tới
    }
});