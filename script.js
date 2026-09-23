// Reveal each chapter once as it scrolls into view, and keep the
// top-bar nav in sync with whichever chapter is on screen.

const chapters = document.querySelectorAll('.chapter');
const navLinks = document.querySelectorAll('.stamps a');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.25 });

chapters.forEach((chapter) => revealObserver.observe(chapter));

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const id = entry.target.id;
    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
    });
  });
}, { threshold: 0.5 });

chapters.forEach((chapter) => {
  if (chapter.id) navObserver.observe(chapter);
});
