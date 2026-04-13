/* ===== DentalTech — F3 Script ===== */
document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();

  /* -- Navbar -- */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });

  /* -- Mobile toggle -- */
  const toggle = document.getElementById('navToggle');
  const links  = document.getElementById('navLinks');
  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
    const spans = toggle.querySelectorAll('span');
    spans[0].style.transform = links.classList.contains('open') ? 'rotate(45deg) translate(5px,5px)' : '';
    spans[1].style.opacity   = links.classList.contains('open') ? '0' : '1';
    spans[2].style.transform = links.classList.contains('open') ? 'rotate(-45deg) translate(5px,-5px)' : '';
  });
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));

  /* -- GSAP -- */
  gsap.registerPlugin(ScrollTrigger);

  document.querySelectorAll('[data-animate]').forEach(el => {
    const delay = parseFloat(el.dataset.delay) || 0;
    const dir   = el.dataset.animate;
    const from  = { opacity: 0, duration: 0.8, ease: 'power3.out', delay };

    if (dir === 'fade-right') from.x = -40;
    else if (dir === 'fade-left') from.x = 40;
    else from.y = 30;

    gsap.from(el, {
      ...from,
      scrollTrigger: { trigger: el, start: 'top 85%', once: true, toggleActions: 'play none none none' },
      onStart: () => el.classList.add('is-visible')
    });
  });

  /* -- Counters -- */
  document.querySelectorAll('.counter').forEach(counter => {
    const target = parseInt(counter.dataset.target);
    gsap.to(counter, {
      innerText: target,
      duration: 2,
      ease: 'power2.out',
      snap: { innerText: 1 },
      scrollTrigger: { trigger: counter, start: 'top 85%', once: true },
      onUpdate() { counter.textContent = Math.round(parseFloat(counter.innerText)).toLocaleString('nl-NL'); }
    });
  });

  /* -- Before / After slider -- */
  const slider = document.getElementById('baSlider');
  const handle = document.getElementById('baHandle');
  if (slider && handle) {
    const beforeImg = slider.querySelector('.ba-before');
    let isDragging = false;

    function updateSlider(x) {
      const rect = slider.getBoundingClientRect();
      let pct = ((x - rect.left) / rect.width) * 100;
      pct = Math.max(2, Math.min(98, pct));
      beforeImg.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
      handle.style.left = pct + '%';
    }

    slider.addEventListener('mousedown', e => { isDragging = true; updateSlider(e.clientX); });
    window.addEventListener('mousemove', e => { if (isDragging) updateSlider(e.clientX); });
    window.addEventListener('mouseup', () => isDragging = false);

    slider.addEventListener('touchstart', e => { isDragging = true; updateSlider(e.touches[0].clientX); }, { passive: true });
    window.addEventListener('touchmove', e => { if (isDragging) updateSlider(e.touches[0].clientX); }, { passive: true });
    window.addEventListener('touchend', () => isDragging = false);
  }

  /* -- Carousel -- */
  const track  = document.querySelector('.carousel-track');
  const slides = document.querySelectorAll('.carousel-slide');
  const dotsContainer = document.querySelector('.carousel-dots');
  const prevBtn = document.querySelector('.carousel-prev');
  const nextBtn = document.querySelector('.carousel-next');
  if (track && slides.length) {
    let current = 0;
    let perView = window.innerWidth > 1024 ? 3 : window.innerWidth > 768 ? 2 : 1;
    const maxIndex = () => Math.max(0, slides.length - perView);

    function buildDots() {
      dotsContainer.innerHTML = '';
      for (let i = 0; i <= maxIndex(); i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === current) dot.classList.add('active');
        dot.addEventListener('click', () => goTo(i));
        dotsContainer.appendChild(dot);
      }
    }

    function goTo(index) {
      current = Math.min(Math.max(index, 0), maxIndex());
      const slideW = slides[0].getBoundingClientRect().width + 16;
      gsap.to(track, { x: -current * slideW, duration: 0.5, ease: 'power2.out' });
      dotsContainer.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === current));
    }

    prevBtn.addEventListener('click', () => goTo(current - 1));
    nextBtn.addEventListener('click', () => goTo(current + 1));

    window.addEventListener('resize', () => {
      perView = window.innerWidth > 1024 ? 3 : window.innerWidth > 768 ? 2 : 1;
      buildDots();
      goTo(Math.min(current, maxIndex()));
    });
    buildDots();
  }

  /* -- Smooth anchor -- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });
});
