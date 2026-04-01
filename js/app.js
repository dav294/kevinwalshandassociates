// app.js — Kevin Walsh & Associates
// GSAP + Lenis scroll animations

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {

  // ─── Lenis Smooth Scroll ─────────────────────────────────────
  const lenis = new Lenis({
    duration: 1.4,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true
  });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // ─── Loader ───────────────────────────────────────────────────
  const loader    = document.getElementById('loader');
  const loaderBar = document.getElementById('loader-bar');

  let pct = 0;
  const tick = setInterval(() => {
    pct += Math.random() * 20 + 5;
    if (pct >= 100) {
      pct = 100;
      clearInterval(tick);
      loaderBar.style.width = '100%';
      setTimeout(hideLoader, 300);
    } else {
      loaderBar.style.width = pct + '%';
    }
  }, 60);

  function hideLoader() {
    gsap.to(loader, {
      opacity: 0,
      duration: 0.8,
      ease: 'power2.inOut',
      onComplete: () => {
        loader.style.display = 'none';
        introAnimation();
      }
    });
  }

  // ─── Intro Animation ─────────────────────────────────────────
  // Hero image: Ken Burns zoom out on load
  gsap.fromTo('#hero-img',
    { scale: 1.18 },
    { scale: 1.05, duration: 2.8, ease: 'power2.out' }
  );

  function introAnimation() {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.to('.hero-eyebrow',    { opacity: 1, y: 0, duration: 0.7 })
      .to('.hero-line',       { opacity: 1, y: 0, duration: 0.9, stagger: 0.15 }, '-=0.4')
      .to('.hero-sub',        { opacity: 1, y: 0, duration: 0.7 }, '-=0.5')
      .to('.scroll-cue',      { opacity: 1, duration: 0.6 }, '-=0.3');
  }

  gsap.set('.hero-eyebrow', { opacity: 0, y: 12 });
  gsap.set('.hero-line',    { opacity: 0, y: 20 });
  gsap.set('.hero-sub',     { opacity: 0, y: 16 });
  gsap.set('.scroll-cue',   { opacity: 0 });

  // ─── Nav: Transparent → Scrolled ────────────────────────────
  const nav = document.getElementById('site-nav');
  let lastScroll = 0;

  lenis.on('scroll', ({ scroll }) => {
    scroll > 60 ? nav.classList.add('scrolled') : nav.classList.remove('scrolled');
    lastScroll = scroll;
  });

  // ─── Hero Image Parallax (scroll away) ───────────────────────
  gsap.to('#hero-img', {
    yPercent: 18,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1.2
    }
  });

  // ─── Intro Section ───────────────────────────────────────────
  gsap.to('.intro-statement', {
    opacity: 1,
    duration: 0.1,
    scrollTrigger: { trigger: '.intro-statement', start: 'top 80%', once: true }
  });

  // Word-by-word reveal for the intro statement
  ScrollTrigger.create({
    trigger: '.intro-statement',
    start: 'top 78%',
    once: true,
    onEnter: () => {
      gsap.to('.intro-statement', { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' });
    }
  });
  gsap.set('.intro-statement', { opacity: 0, y: 30 });

  gsap.fromTo('.intro-tags span',
    { opacity: 0, y: 16 },
    {
      opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: '.intro-tags', start: 'top 82%', once: true }
    }
  );

  // ─── Projects: Parallax + Content Reveal ─────────────────────
  document.querySelectorAll('.project').forEach(project => {
    const img  = project.querySelector('.project-bg img');
    const num  = project.querySelector('.project-num');
    const title = project.querySelector('.project-title');
    const desc = project.querySelector('.project-desc');
    const link = project.querySelector('.project-link');

    // Image parallax — image moves up at ~40% scroll speed
    gsap.fromTo(img,
      { yPercent: -8 },
      {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: {
          trigger: project,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5
        }
      }
    );

    // Content staggered reveal
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: project,
        start: 'top 65%',
        once: true
      }
    });

    tl.to(num,   { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' })
      .to(title, { opacity: 1, y: 0, duration: 0.85, ease: 'power3.out' }, '-=0.2')
      .to(desc,  { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.5')
      .to(link,  { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, '-=0.4');

    gsap.set([num, title, desc, link], { opacity: 0, y: 28 });
  });

  // ─── Services ────────────────────────────────────────────────
  gsap.to('.services-heading', {
    opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
    scrollTrigger: { trigger: '.services-heading', start: 'top 80%', once: true }
  });
  gsap.set('.services-heading', { opacity: 0, y: 24 });

  gsap.fromTo('.service-item',
    { opacity: 0, y: 30 },
    {
      opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out',
      scrollTrigger: { trigger: '.services-grid', start: 'top 78%', once: true }
    }
  );

  // ─── FAQ Accordion ───────────────────────────────────────
  gsap.fromTo('.faq-heading',
    { opacity: 0, y: 24 },
    { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: '.faq-header', start: 'top 80%', once: true } }
  );
  gsap.fromTo('.faq-intro',
    { opacity: 0, y: 16 },
    { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: 0.15,
      scrollTrigger: { trigger: '.faq-header', start: 'top 80%', once: true } }
  );
  gsap.fromTo('.faq-item',
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: '.faq-list', start: 'top 82%', once: true } }
  );

  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      const answer = btn.nextElementSibling;

      // Close all others
      document.querySelectorAll('.faq-question').forEach(other => {
        if (other !== btn) {
          other.setAttribute('aria-expanded', 'false');
          other.nextElementSibling.style.maxHeight = '0';
        }
      });

      if (isOpen) {
        btn.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = '0';
      } else {
        btn.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // ─── Contact Section ─────────────────────────────────────────
  const ctaTl = gsap.timeline({
    scrollTrigger: { trigger: '.contact-section', start: 'top 68%', once: true }
  });

  ctaTl
    .to('.contact-heading', { opacity: 1, y: 0, duration: 1.0, ease: 'power3.out' })
    .to('.contact-sub',     { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out' }, '-=0.6')
    .to('.contact-actions', { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.5');

  gsap.set(['.contact-heading', '.contact-sub', '.contact-actions'], { opacity: 0, y: 32 });

  // ─── Contact Popup ───────────────────────────────────────
  const popup   = document.getElementById('contact-popup');
  const backdrop = popup.querySelector('.contact-popup-backdrop');
  const closeBtn = popup.querySelector('.contact-popup-close');

  function openPopup() {
    popup.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closePopup() {
    popup.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  // project-link buttons — popup on all devices
  document.querySelectorAll('.project-link').forEach(btn => {
    btn.addEventListener('click', openPopup);
  });

  // nav-cta — popup on all devices
  const navCta = document.querySelector('.nav-cta');
  navCta.addEventListener('click', e => {
    e.preventDefault();
    openPopup();
  });

  backdrop.addEventListener('click', closePopup);
  closeBtn.addEventListener('click', closePopup);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closePopup(); });

});
