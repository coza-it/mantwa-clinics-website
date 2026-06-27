/* Mobile nav */
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');

hamburger.addEventListener('click', () => {
  const open = mobileNav.classList.toggle('open');
  hamburger.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

function closeMobileNav() {
  mobileNav.classList.remove('open');
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

/* Scroll reveal */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* Active nav on scroll */
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.45 });

sections.forEach(s => navObserver.observe(s));

/* Count-up animation */
function animateCount(el) {
  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || '';
  const duration = 1800;
  const start = performance.now();
  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.floor(eased * target);
    el.textContent = (target >= 1000 ? value.toLocaleString() : value) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const countObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCount(e.target);
      countObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number[data-target]').forEach(el => countObserver.observe(el));

/* Booking form — submit via fetch, stay on page */
const bookingForm = document.getElementById('booking-form');
if (bookingForm) {
  bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('form-submit');
    const success = document.getElementById('form-success');
    btn.disabled = true;
    btn.textContent = 'Sending…';
    try {
      const res = await fetch('https://formspree.io/f/xeebkenv', {
        method: 'POST',
        body: new FormData(bookingForm),
        headers: { Accept: 'application/json' }
      });
      if (res.ok) {
        bookingForm.reset();
        success.style.display = 'flex';
        btn.style.display = 'none';
      } else {
        btn.disabled = false;
        btn.innerHTML = 'Send Request <i class="fas fa-arrow-right"></i>';
        alert('Something went wrong. Please try again or call us directly.');
      }
    } catch {
      btn.disabled = false;
      btn.innerHTML = 'Send Request <i class="fas fa-arrow-right"></i>';
      alert('Something went wrong. Please try again or call us directly.');
    }
  });
}
