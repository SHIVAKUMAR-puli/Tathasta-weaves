// Palette + weave drafting. No DOM access outside drawWeave, so it's safe to import anywhere.

export function hash(str) {
  let h = 2166136261;
  for (const c of str) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

export function rng(seed) {
  return () => (seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296;
}

/* ---------- prompt -> palette ("mood engine") ---------- */
const MOODS = [
  { words: ['indigo', 'night', 'ocean', 'sea', 'blue', 'monsoon', 'rain', 'calm'], hues: [228, 214, 200, 35] },
  { words: ['sunset', 'fire', 'festive', 'wedding', 'red', 'rich', 'royal', 'marigold'], hues: [8, 28, 345, 48] },
  { words: ['forest', 'green', 'earthy', 'earth', 'moss', 'garden', 'leaf', 'spring'], hues: [140, 95, 38, 22] },
  { words: ['desert', 'sand', 'gold', 'warm', 'autumn', 'spice', 'turmeric'], hues: [38, 22, 14, 52] },
  { words: ['lavender', 'dream', 'soft', 'pastel', 'dawn', 'bloom', 'rose'], hues: [275, 330, 20, 190] },
  { words: ['mono', 'minimal', 'charcoal', 'stone', 'winter', 'snow'], hues: [220, 220, 30, 0] },
];

export function buildPalette(text, salt) {
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
export function drawWeave(ctx, w, h, { colors, weave, cell, seed }) {
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
