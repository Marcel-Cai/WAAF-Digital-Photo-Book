// ---- View routing (home <-> album pages) with a zoom-style crossfade ----
const views = document.querySelectorAll('.view');
const plane = document.querySelector('.plane');
let animating = false;

function getView(id){ return document.getElementById(id); }

function activate(id){
  const target = getView(id);
  if(!target) return;
  const current = document.querySelector('.view.is-active');
  if(current === target) return;

  if(current){
    current.classList.remove('in');
    current.classList.add('out');
    setTimeout(() => {
      current.classList.remove('is-active', 'out');
    }, 320);
  }

  target.classList.add('is-active');
  target.classList.remove('out');
  // force reflow so the 'in' transition actually plays
  void target.offsetWidth;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => target.classList.add('in'));
  });

  if (history.pushState) {
    history.pushState(null, '', `#${id}`);
  } else {
    location.hash = id;
  }
  window.scrollTo(0, 0);
}

function activateInstant(id){
  views.forEach(v => v.classList.remove('is-active', 'in', 'out'));
  const target = getView(id) || getView('home');
  target.classList.add('is-active', 'in');
}

function flyPlane(fromEl){
  const rect = fromEl.getBoundingClientRect();
  plane.style.left = (rect.left + rect.width / 2) + 'px';
  plane.style.top = (rect.top + rect.height / 2) + 'px';
  plane.classList.remove('flying');
  void plane.offsetWidth;
  plane.classList.add('flying');
}

document.querySelectorAll('[data-album]').forEach(el => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    if (animating) return;
    animating = true;
    flyPlane(el);
    setTimeout(() => {
      activate(el.dataset.album);
      animating = false;
    }, 160);
  });
});

document.querySelectorAll('[data-back]').forEach(btn => {
  btn.addEventListener('click', () => activate('home'));
});

document.querySelector('.brand').addEventListener('click', (e) => {
  e.preventDefault();
  activate('home');
});

window.addEventListener('popstate', () => {
  const id = location.hash.replace('#', '') || 'home';
  activate(id);
});

// ---- Per-album photo viewer (arrows + dots) ----
document.querySelectorAll('.view--album').forEach(album => {
  const slides = [...album.querySelectorAll('.photo-slide')];
  if (!slides.length) return; // thank-you page has no photo viewer

  const dotsWrap = album.querySelector('.dots');
  let index = 0;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'dot' + (i === 0 ? ' is-active' : '');
    dot.setAttribute('aria-label', `Photo ${i + 1} of ${slides.length}`);
    dot.addEventListener('click', () => go(i));
    dotsWrap.appendChild(dot);
  });
  const dots = [...dotsWrap.children];

  function render(){
    slides.forEach((s, i) => s.classList.toggle('is-active', i === index));
    dots.forEach((d, i) => d.classList.toggle('is-active', i === index));
  }
  function go(i){
    index = (i + slides.length) % slides.length;
    render();
  }

  album.querySelector('[data-next]')?.addEventListener('click', () => go(index + 1));
  album.querySelector('[data-prev]')?.addEventListener('click', () => go(index - 1));
});

// ---- Initial load: respect a direct link like page.html#sg ----
const initial = location.hash.replace('#', '');
if (initial && getView(initial)) {
  activateInstant(initial);
}
