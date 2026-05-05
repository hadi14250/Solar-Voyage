import * as THREE from "three";

function createCanvas(w: number, h: number): {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
} {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  return { canvas, ctx };
}

function toTexture(canvas: HTMLCanvasElement): THREE.CanvasTexture {
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  tex.needsUpdate = true;
  return tex;
}

/** Seeded pseudo-random for repeatable procedural textures. */
function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Procedural Earth: blue ocean + green continent splotches with noise. */
export function makeEarthTexture(): THREE.CanvasTexture {
  const W = 1024;
  const H = 512;
  const { canvas, ctx } = createCanvas(W, H);
  const rand = mulberry32(7);

  // Ocean base — gradient
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, "#0a3d8a");
  grad.addColorStop(0.5, "#1e6db8");
  grad.addColorStop(1, "#0a3d8a");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Speckle for water variation
  for (let i = 0; i < 4000; i++) {
    const x = rand() * W;
    const y = rand() * H;
    const a = 0.04 + rand() * 0.06;
    ctx.fillStyle = `rgba(255,255,255,${a})`;
    ctx.fillRect(x, y, 1, 1);
  }

  // Continent splotches — clusters of organic blobs
  const continentCenters: Array<[number, number, number]> = [
    [180, 180, 110], // North America-ish
    [240, 320, 90], // South America
    [510, 200, 130], // Eurasia
    [560, 320, 100], // Africa
    [770, 380, 80], // Australia
    [430, 430, 70], // Antarctica edge
    [880, 220, 60], // East Asia islets
  ];

  for (const [cx, cy, baseR] of continentCenters) {
    const blobs = 28 + Math.floor(rand() * 18);
    for (let i = 0; i < blobs; i++) {
      const dx = (rand() - 0.5) * baseR * 1.5;
      const dy = (rand() - 0.5) * baseR * 0.9;
      const r = baseR * (0.25 + rand() * 0.55);
      const g1 = 110 + Math.floor(rand() * 60);
      const g2 = 70 + Math.floor(rand() * 40);
      ctx.fillStyle = `rgb(${30 + Math.floor(rand() * 40)},${g1},${g2})`;
      ctx.beginPath();
      ctx.ellipse(
        cx + dx,
        cy + dy,
        r,
        r * (0.55 + rand() * 0.5),
        rand() * Math.PI,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
  }

  // A bit of warm desert tone overlay near the equator
  ctx.globalCompositeOperation = "source-atop";
  for (let i = 0; i < 380; i++) {
    const x = rand() * W;
    const y = H * 0.45 + (rand() - 0.5) * H * 0.18;
    const r = 6 + rand() * 14;
    ctx.fillStyle = `rgba(212,165,116,${0.18 + rand() * 0.18})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalCompositeOperation = "source-over";

  // Subtle ice on poles
  const iceTop = ctx.createLinearGradient(0, 0, 0, 60);
  iceTop.addColorStop(0, "rgba(240,250,255,0.95)");
  iceTop.addColorStop(1, "rgba(240,250,255,0)");
  ctx.fillStyle = iceTop;
  ctx.fillRect(0, 0, W, 60);

  const iceBot = ctx.createLinearGradient(0, H - 60, 0, H);
  iceBot.addColorStop(0, "rgba(240,250,255,0)");
  iceBot.addColorStop(1, "rgba(240,250,255,0.95)");
  ctx.fillStyle = iceBot;
  ctx.fillRect(0, H - 60, W, 60);

  return toTexture(canvas);
}

/** Procedural cloud layer — white wisps on transparent. */
export function makeCloudsTexture(): THREE.CanvasTexture {
  const W = 1024;
  const H = 512;
  const { canvas, ctx } = createCanvas(W, H);
  const rand = mulberry32(91);
  ctx.clearRect(0, 0, W, H);
  for (let i = 0; i < 220; i++) {
    const x = rand() * W;
    const y = rand() * H;
    const r = 12 + rand() * 38;
    const a = 0.18 + rand() * 0.5;
    const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, `rgba(255,255,255,${a})`);
    grad.addColorStop(1, `rgba(255,255,255,0)`);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  return toTexture(canvas);
}

/** Procedural Mars: rusty surface + white polar caps. */
export function makeMarsTexture(): THREE.CanvasTexture {
  const W = 1024;
  const H = 512;
  const { canvas, ctx } = createCanvas(W, H);
  const rand = mulberry32(42);

  // Base rust
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, "#a8341a");
  grad.addColorStop(0.5, "#c1440e");
  grad.addColorStop(1, "#9a2f15");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Surface variation blobs
  for (let i = 0; i < 600; i++) {
    const x = rand() * W;
    const y = rand() * H;
    const r = 4 + rand() * 26;
    const shade = 80 + Math.floor(rand() * 110);
    ctx.fillStyle = `rgba(${shade + 40},${Math.floor(shade * 0.45)},${Math.floor(shade * 0.25)},${0.25 + rand() * 0.45})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Dark valleys (Valles Marineris hint)
  ctx.fillStyle = "rgba(60,20,10,0.55)";
  ctx.beginPath();
  ctx.ellipse(W * 0.55, H * 0.55, 220, 14, 0, 0, Math.PI * 2);
  ctx.fill();

  // Crater dots
  for (let i = 0; i < 120; i++) {
    const x = rand() * W;
    const y = rand() * H;
    const r = 1 + rand() * 4;
    ctx.fillStyle = "rgba(40,15,5,0.55)";
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // North polar cap
  const top = ctx.createLinearGradient(0, 0, 0, 75);
  top.addColorStop(0, "rgba(245,250,255,1)");
  top.addColorStop(0.7, "rgba(240,245,250,0.85)");
  top.addColorStop(1, "rgba(245,250,255,0)");
  ctx.fillStyle = top;
  ctx.fillRect(0, 0, W, 75);

  // South polar cap
  const bot = ctx.createLinearGradient(0, H - 75, 0, H);
  bot.addColorStop(0, "rgba(245,250,255,0)");
  bot.addColorStop(0.3, "rgba(240,245,250,0.85)");
  bot.addColorStop(1, "rgba(245,250,255,1)");
  ctx.fillStyle = bot;
  ctx.fillRect(0, H - 75, W, 75);

  return toTexture(canvas);
}

/** Procedural Jupiter: horizontal bands + Great Red Spot. */
export function makeJupiterTexture(): THREE.CanvasTexture {
  const W = 1024;
  const H = 512;
  const { canvas, ctx } = createCanvas(W, H);
  const rand = mulberry32(310);

  const bands: Array<{ y: number; h: number; color: string }> = [
    { y: 0, h: 30, color: "#a87148" },
    { y: 30, h: 28, color: "#d6a064" },
    { y: 58, h: 36, color: "#e9c79a" },
    { y: 94, h: 30, color: "#b88458" },
    { y: 124, h: 38, color: "#e1b076" },
    { y: 162, h: 24, color: "#a16638" },
    { y: 186, h: 44, color: "#efd6a8" },
    { y: 230, h: 30, color: "#c7935f" },
    { y: 260, h: 36, color: "#d8a672" },
    { y: 296, h: 24, color: "#a16638" },
    { y: 320, h: 38, color: "#efd6a8" },
    { y: 358, h: 30, color: "#c7935f" },
    { y: 388, h: 30, color: "#b88458" },
    { y: 418, h: 32, color: "#e1b076" },
    { y: 450, h: 36, color: "#d6a064" },
    { y: 486, h: 26, color: "#a87148" },
  ];
  for (const b of bands) {
    ctx.fillStyle = b.color;
    ctx.fillRect(0, b.y, W, b.h);
  }

  // Turbulence — small streaks that follow the bands
  for (let i = 0; i < 3000; i++) {
    const y = rand() * H;
    const x = rand() * W;
    const len = 8 + rand() * 60;
    ctx.fillStyle = `rgba(${100 + Math.floor(rand() * 140)},${
      70 + Math.floor(rand() * 80)
    },${40 + Math.floor(rand() * 40)},${0.10 + rand() * 0.15})`;
    ctx.fillRect(x, y, len, 1.5);
  }

  // Great Red Spot
  const spot = ctx.createRadialGradient(W * 0.3, H * 0.62, 4, W * 0.3, H * 0.62, 70);
  spot.addColorStop(0, "rgba(180,40,20,0.95)");
  spot.addColorStop(0.6, "rgba(150,40,20,0.7)");
  spot.addColorStop(1, "rgba(150,40,20,0)");
  ctx.fillStyle = spot;
  ctx.beginPath();
  ctx.ellipse(W * 0.3, H * 0.62, 70, 32, 0, 0, Math.PI * 2);
  ctx.fill();

  return toTexture(canvas);
}
