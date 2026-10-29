/* Tathasta Weaves — client-side "AI" features.
   Everything runs in the browser. To use a real LLM / image model, replace
   buildPalette() and advise() with calls to your backend endpoint. */

const $ = (s) => document.querySelector(s);
$('#year').textContent = new Date().getFullYear();

/* ---------- seeded RNG ---------- */
function hash(str) { let h = 2166136261; for (const c of str) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
function rng(seed) { return () => (seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296; }

/* ---------- prompt -> palette ("mood engine") ---------- */
const MOODS = [
  { words: ['indigo', 'night', 'ocean', 'sea', 'blue', 'monsoon', 'rain', 'calm'], hues: [228, 214, 200, 35] },
  { words: ['sunset', 'fire', 'festive', 'wedding', 'red', 'rich', 'royal', 'marigold'], hues: [8, 28, 345, 48] },
  { words: ['forest', 'green', 'earthy', 'earth', 'moss', 'garden', 'leaf', 'spring'], hues: [140, 95, 38, 22] },
  { words: ['desert', 'sand', 'gold', 'warm', 'autumn', 'spice', 'turmeric'], hues: [38, 22, 14, 52] },
  { words: ['lavender', 'dream', 'soft', 'pastel', 'dawn', 'bloom', 'rose'], hues: [275, 330, 20, 190] },
  { words: ['mono', 'minimal', 'charcoal', 'stone', 'winter', 'snow'], hues: [220, 220, 30, 0] },
];
function buildPalette(text, salt) {
  const t = text.toLowerCase();
  let best = null, score = 0;
  for (const m of MOODS) {
    const s = m.words.filter((w) => t.includes(w)).length;
    if (s > score) { score = s; best = m; }
  }
  const r = rng(hash(t + salt));
  const hues = (best || MOODS[Math.floor(r() * MOODS.length)]).hues;
  const soft = /calm|soft|pastel|minimal|dawn/.test(t);
  const colors = hues.map((h, i) => {
    const hh = (h + (r() - 0.5) * 16 + 360) % 360;
    const sat = (soft ? 28 : 55) + r() * 20;
    const light = i === 3 ? 82 : 28 + i * 14 + r() * 8;
    return `hsl(${hh.toFixed(0)} ${sat.toFixed(0)}% ${light.toFixed(0)}%)`;
  });
  return { colors, matched: best !== null };
}

/* ---------- weave renderer ---------- */
function drawWeave(ctx, w, h, { colors, weave, cell, seed }) {
  const r = rng(seed);
  const cols = Math.ceil(w / cell), rows = Math.ceil(h / cell);
  const warp = Array.from({ length: cols }, () => Math.floor(r() * colors.length));
  const weft = Array.from({ length: rows }, () => Math.floor(r() * colors.length));
  // plaid / check stripes: wide bands repeat
  const band = (arr, n) => arr.map((_, i) => arr[Math.floor(i / n) * n % arr.length]);
  const warpP = weave === 'plaid' ? band(warp, 4) : warp;
  const weftP = weave === 'plaid' ? band(weft, 4) : weft;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let over; // is warp thread on top at this crossing?
      switch (weave) {
        case 'plain': over = (x + y) % 2 === 0; break;
        case 'herringbone': {
          const seg = Math.floor(x / 6) % 2;
          over = seg ? (x + y) % 4 < 2 : (x - y + 400) % 4 < 2; break;
        }
        case 'ikat': {
          const d = Math.abs(((x + y * 0.5) % 16) - 8);
          over = d > 3 ? (x + y) % 3 !== 0 : (x + y) % 3 === 0; break;
        }
        default: over = (x + y) % 4 < 2; // twill
      }
      const ci = over ? warpP[x] : weftP[y];
      const px = x * cell, py = y * cell;
      ctx.fillStyle = colors[ci];
      ctx.fillRect(px, py, cell, cell);
      // thread shading for a woven look
      const g = over ? ctx.createLinearGradient(px, 0, px + cell, 0) : ctx.createLinearGradient(0, py, 0, py + cell);
      g.addColorStop(0, 'rgba(0,0,0,.22)'); g.addColorStop(.5, 'rgba(255,255,255,.14)'); g.addColorStop(1, 'rgba(0,0,0,.22)');
      ctx.fillStyle = g;
      ctx.fillRect(px + 0.5, py + 0.5, cell - 1, cell - 1);
    }
  }
}

/* ---------- Weave Studio ---------- */
const studio = $('#studioCanvas'), sctx = studio.getContext('2d');
let salt = 0;
function generate() {
  const text = $('#prompt').value.trim() || 'untitled weave';
  const { colors, matched } = buildPalette(text, salt);
  const seed = hash(text + $('#weave').value + salt);
  drawWeave(sctx, studio.width, studio.height, { colors, weave: $('#weave').value, cell: Math.round(studio.width / (+$('#density').value * 1.6)) || 8, seed });
  $('#palette').innerHTML = colors.map((c) => `<span style="background:${c}" title="${c}"></span>`).join('');
  $('#studioNote').textContent = matched
    ? 'Palette inferred from the mood in your prompt. Press Generate again for a new variation.'
    : 'No strong mood keywords found — we improvised a palette. Try words like "indigo", "festive" or "earthy".';
  salt++;
}
$('#generate').onclick = generate;
$('#density').oninput = (e) => { $('#densityOut').textContent = e.target.value; };
$('#density').onchange = () => { salt--; generate(); };
$('#weave').onchange = () => { salt--; generate(); };
$('#download').onclick = () => {
  const a = document.createElement('a');
  a.download = 'tathasta-weave.png'; a.href = studio.toDataURL('image/png'); a.click();
};
generate();

/* ---------- Collection ---------- */
const FABRICS = [
  { name: 'Kaveri Cotton', tags: 'cotton shirt summer hot breathable light kurta casual lightweight', use: 'Shirts, kurtas, summer wear', price: 1, hue: 200, weave: 'plain', desc: 'Airy 100% cotton with a soft hand — made for heat and humidity.' },
  { name: 'Ruhani Silk', tags: 'silk saree wedding festive rich luxury drape formal bridal celebration', use: 'Sarees, bridal, festive', price: 3, hue: 345, weave: 'twill', desc: 'Lustrous silk with a fluid drape and zari-ready finish.' },
  { name: 'Madhav Canvas', tags: 'upholstery sofa durable heavy curtains bag strong furniture home cushion', use: 'Upholstery, bags, soft furnishing', price: 2, hue: 30, weave: 'herringbone', desc: 'Dense, abrasion-resistant weave that ages beautifully.' },
  { name: 'Himani Wool Blend', tags: 'wool shawl winter warm soft cold scarf stole cozy', use: 'Shawls, stoles, winter wear', price: 3, hue: 275, weave: 'plaid', desc: 'Featherlight wool-silk blend that traps warmth without bulk.' },
  { name: 'Neel Linen', tags: 'linen shirt summer breathable trousers dress relaxed holiday', use: 'Shirts, dresses, trousers', price: 2, hue: 228, weave: 'plain', desc: 'Natural slub linen, cool on skin and relaxed in form.' },
  { name: 'Tarang Ikat', tags: 'ikat pattern festive statement dupatta fusion handloom artisan', use: 'Dupattas, jackets, accents', price: 2, hue: 8, weave: 'ikat', desc: 'Resist-dyed yarns produce its signature feathered edges.' },
];
const grid = $('#grid');
FABRICS.forEach((f, i) => {
  const el = document.createElement('div'); el.className = 'fabric';
  el.innerHTML = `<canvas width="320" height="160"></canvas><div><h3>${f.name}</h3><p>${f.desc}</p><p><strong>${f.use}</strong></p></div>`;
  grid.append(el);
  const colors = [0, 1, 2, 3].map((k) => `hsl(${(f.hue + k * 12) % 360} ${45 + k * 5}% ${26 + k * 16}%)`);
  drawWeave(el.querySelector('canvas').getContext('2d'), 320, 160, { colors, weave: f.weave, cell: 8, seed: i * 77 + 3 });
});

/* ---------- Fabric Advisor ---------- */
const msgs = $('#messages');
function say(html, who) {
  const d = document.createElement('div'); d.className = `msg ${who}`; d.innerHTML = html;
  msgs.append(d); msgs.scrollTop = msgs.scrollHeight;
}
const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
function advise(q) {
  const words = q.toLowerCase().match(/[a-z]+/g) || [];
  const scored = FABRICS.map((f) => {
    const tags = f.tags.split(' ');
    let s = words.filter((w) => w.length > 2 && tags.some((t) => t.startsWith(w) || w.startsWith(t))).length;
    if (/cheap|budget|afford/.test(q.toLowerCase())) s += 3 - f.price > 0 ? (3 - f.price) * 0.6 : 0;
    if (/luxur|premium/.test(q.toLowerCase())) s += f.price * 0.5;
    return { f, s };
  }).filter((x) => x.s > 0).sort((a, b) => b.s - a.s).slice(0, 3);
  if (!scored.length) {
    return "I couldn't match that to our catalogue yet. Tell me what you're making (shirt, saree, sofa…), the season or climate, and how it should feel.";
  }
  return `Here's what I'd suggest for that:<ul>${scored.map(({ f }) =>
    `<li><strong>${f.name}</strong> — ${f.desc} <em>(${f.use})</em></li>`).join('')}</ul>Want a custom pattern for it? Try the Weave Studio above.`;
}
say("Hi, I'm the Tathasta advisor. What are you planning to make?", 'bot');
function ask(q) {
  say(esc(q), 'user');
  setTimeout(() => say(advise(q), 'bot'), 450);
}
$('#chatForm').onsubmit = (e) => {
  e.preventDefault();
  const v = $('#chatInput').value.trim(); if (!v) return;
  $('#chatInput').value = ''; ask(v);
};
$('#chips').onclick = (e) => { if (e.target.tagName === 'BUTTON') ask(e.target.textContent); };

/* ---------- Hero animation ---------- */
const hero = $('#heroCanvas'), hctx = hero.getContext('2d');
function resizeHero() { hero.width = hero.clientWidth / 2; hero.height = hero.clientHeight / 2; }
function paintHero() {
  const colors = ['hsl(228 45% 28%)', 'hsl(14 65% 48%)', 'hsl(38 70% 60%)', 'hsl(40 40% 88%)'];
  drawWeave(hctx, hero.width, hero.height, { colors, weave: 'twill', cell: 10, seed: 42 });
}
resizeHero(); paintHero();
addEventListener('resize', () => { resizeHero(); paintHero(); });

/* ---------- Stat counters ---------- */
const io = new IntersectionObserver((entries) => entries.forEach((en) => {
  if (!en.isIntersecting) return;
  const el = en.target, end = +el.dataset.count, t0 = performance.now();
  const tick = (t) => {
    const p = Math.min((t - t0) / 1200, 1);
    el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))).toLocaleString();
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick); io.unobserve(el);
}), { threshold: 0.4 });
document.querySelectorAll('[data-count]').forEach((el) => io.observe(el));

/* ---------- Contact ---------- */
$('#contactForm').onsubmit = (e) => {
  e.preventDefault();
  $('#contactNote').textContent = 'Thank you — we\'ll be in touch within a day. (Demo form: connect it to your backend or email service.)';
  e.target.reset();
};
