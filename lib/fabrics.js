// TODO: replace with the real catalogue
export const FABRICS = [
  { name: 'Kaveri Cotton', use: 'Shirts, kurtas, summer wear', hue: 200, weave: 'plain', desc: 'Airy 100% cotton with a soft hand, made for heat and humidity.' },
  { name: 'Ruhani Silk', use: 'Sarees, bridal, festive', hue: 345, weave: 'twill', desc: 'Lustrous silk with a fluid drape and a zari-ready finish.' },
  { name: 'Madhav Canvas', use: 'Upholstery, bags, soft furnishing', hue: 30, weave: 'herringbone', desc: 'A dense, hard-wearing weave that softens and ages well.' },
  { name: 'Himani Wool Blend', use: 'Shawls, stoles, winter wear', hue: 275, weave: 'plaid', desc: 'Featherlight wool and silk that keeps warm without the bulk.' },
  { name: 'Neel Linen', use: 'Shirts, dresses, trousers', hue: 228, weave: 'plain', desc: 'Natural slub linen, cool on the skin and relaxed in form.' },
  { name: 'Tarang Ikat', use: 'Dupattas, jackets, accents', hue: 8, weave: 'ikat', desc: 'Resist-dyed yarns give it those feathered, slightly blurred edges.' },
];

export function fabricColors(f) {
  return [0, 1, 2, 3].map((k) => `hsl(${(f.hue + k * 12) % 360} ${45 + k * 5}% ${26 + k * 16}%)`);
}
