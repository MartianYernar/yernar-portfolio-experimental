document.getElementById('yr').textContent = new Date().getFullYear();

// mobile nav
const burger = document.getElementById('burger'), navlinks = document.getElementById('navlinks');
burger.addEventListener('click', () => navlinks.classList.toggle('open'));
navlinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navlinks.classList.remove('open')));

// custom magnetic cursor
const dot = document.getElementById('cursorDot'), ring = document.getElementById('cursorRing');
let rx = 0, ry = 0, mx = 0, my = 0;
addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`; });
(function loop(){ rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18; ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`; requestAnimationFrame(loop); })();
document.addEventListener('mouseover', e => { if (e.target.closest('a,button,.bento-tile,.card')) ring.classList.add('active'); });
document.addEventListener('mouseout', e => { if (e.target.closest('a,button,.bento-tile,.card')) ring.classList.remove('active'); });

// typing hero tagline
const roles = ['RESEARCHER.', 'BUILDER.', 'FOUNDER.', 'MENTOR.'];
const typingEl = document.getElementById('typing');
let ri = 0, ci = 0, deleting = false;
function tick() {
  const word = roles[ri];
  if (!deleting) {
    ci++;
    typingEl.textContent = word.slice(0, ci);
    if (ci === word.length) { deleting = true; setTimeout(tick, 1400); return; }
  } else {
    ci--;
    typingEl.textContent = word.slice(0, ci);
    if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; }
  }
  setTimeout(tick, deleting ? 45 : 90);
}
tick();

// live GitHub stats
fetch('https://api.github.com/users/MartianYernar')
  .then(r => r.ok ? r.json() : null)
  .then(d => {
    if (!d) return;
    document.getElementById('ghRepos').textContent = d.public_repos ?? '—';
    document.getElementById('ghFollowers').textContent = d.followers ?? '—';
  })
  .catch(() => {});

const CL = window.CLUSTERS || [];

// evidence gallery
function card(src, cap, cls) {
  const d = document.createElement('div'); d.className = cls;
  d.dataset.src = src; d.dataset.cap = cap || '';
  d.innerHTML = `<img src="${src}" alt="${(cap||'').replace(/"/g,'&quot;')}" loading="lazy">`;
  return d;
}
const wrap = document.getElementById('clusters');
CL.forEach(c => {
  const sec = document.createElement('div'); sec.className = 'cluster'; sec.dataset.group = c.group;
  const head = document.createElement('div'); head.className = 'c-head';
  head.innerHTML = `<h3>${c.title}</h3><span>${c.result||''}</span>`;
  const imgs = document.createElement('div'); imgs.className = 'c-imgs';
  c.images.forEach(im => imgs.appendChild(card(im.src, im.cap, 'card')));
  sec.appendChild(head); sec.appendChild(imgs); wrap.appendChild(sec);
});
document.getElementById('filters').addEventListener('click', e => {
  const b = e.target.closest('.chip'); if (!b) return;
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  b.classList.add('active');
  const g = b.dataset.g;
  document.querySelectorAll('.cluster').forEach(cl => cl.style.display = (g==='all'||cl.dataset.group===g) ? '' : 'none');
});

// lightbox
const lb = document.getElementById('lightbox'), lbImg = document.getElementById('lbImg'), lbCap = document.getElementById('lbCap');
let cur = null;
function vis(){ return [...document.querySelectorAll('#clusters .cluster')].filter(c=>c.style.display!=='none').flatMap(c=>[...c.querySelectorAll('.card')]); }
function openLB(el){ cur=el; lbImg.src=el.dataset.src; lbImg.alt=el.dataset.cap; lbCap.textContent=el.dataset.cap; lb.classList.add('open'); document.body.style.overflow='hidden'; }
function closeLB(){ lb.classList.remove('open'); document.body.style.overflow=''; }
function step(d){ const v=vis(), i=v.indexOf(cur); if(i<0)return; openLB(v[(i+d+v.length)%v.length]); }
wrap.addEventListener('click', e => { const el=e.target.closest('.card'); if(el) openLB(el); });
document.getElementById('lbClose').addEventListener('click', closeLB);
document.getElementById('lbPrev').addEventListener('click', () => step(-1));
document.getElementById('lbNext').addEventListener('click', () => step(1));
lb.addEventListener('click', e => { if(e.target===lb) closeLB(); });
addEventListener('keydown', e => { if(!lb.classList.contains('open'))return; if(e.key==='Escape')closeLB(); if(e.key==='ArrowLeft')step(-1); if(e.key==='ArrowRight')step(1); });

// scroll reveal
const io = new IntersectionObserver(es => es.forEach(en => en.target.classList.toggle('visible', en.isIntersecting)), {threshold:.08, rootMargin:'0px 0px -8% 0px'});
document.querySelectorAll('.reveal').forEach(el => io.observe(el));
