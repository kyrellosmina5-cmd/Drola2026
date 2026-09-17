import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function crc32(buf) {
  let table = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) c = 0xedb88320 ^ (c >>> 1);
      else c = c >>> 1;
    }
    table[n] = c >>> 0;
  }
  let crc = 0 ^ (-1);
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ (-1)) >>> 0;
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4);
  const crcData = Buffer.concat([typeBuf, data]);
  crcBuf.writeUInt32BE(crc32(crcData), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function generatePng(width, height, isMaskable = false) {
  // Create RGBA pixel buffer with filter byte per line
  const rowSize = 1 + width * 4;
  const raw = Buffer.alloc(height * rowSize);

  const cx = width / 2;
  const cy = height / 2;
  const radius = (width / 2) * (isMaskable ? 0.95 : 0.88);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    raw[rowOffset] = 0; // Filter: None

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Background rounded shield/circle
      let r = 13, g = 148, b = 136, a = 255; // #0d9488 (Teal 600)

      if (isMaskable) {
        // Full bleed background with gradient
        const t = (x + y) / (width + height);
        r = Math.round(15 * (1 - t) + 16 * t);
        g = Math.round(118 * (1 - t) + 185 * t);
        b = Math.round(110 * (1 - t) + 129 * t);
        a = 255;
      } else {
        // Rounded squircle
        const cornerDist = Math.max(Math.abs(dx), Math.abs(dy));
        if (cornerDist > radius && dist > radius) {
          a = 0;
        } else {
          const t = (x + y) / (width + height);
          r = Math.round(13 * (1 - t) + 16 * t);
          g = Math.round(148 * (1 - t) + 185 * t);
          b = Math.round(136 * (1 - t) + 129 * t);
          a = 255;
        }
      }

      // Draw Medical Cross & Shield Emblem in the center (Safe Zone)
      const scale = isMaskable ? 0.35 : 0.45;
      const crossW = width * scale * 0.32;
      const crossL = width * scale * 0.95;

      const inVertBar = Math.abs(dx) <= crossW / 2 && Math.abs(dy) <= crossL / 2;
      const inHorizBar = Math.abs(dy) <= crossW / 2 && Math.abs(dx) <= crossL / 2;

      if (a > 0 && (inVertBar || inHorizBar)) {
        // White medical cross
        r = 255;
        g = 255;
        b = 255;
        a = 255;
      }

      raw[pxOffset] = r;
      raw[pxOffset + 1] = g;
      raw[pxOffset + 2] = b;
      raw[pxOffset + 3] = a;
    }
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // Bit depth
  ihdr[9] = 6; // Color type: RGBA
  ihdr[10] = 0; // Compression: Deflate
  ihdr[11] = 0; // Filter: Adaptive
  ihdr[12] = 0; // Interlace: None

  const compressedData = zlib.deflateSync(raw);

  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', compressedData);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

const outDir = path.resolve(process.cwd(), 'public');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Generate PWA icons
fs.writeFileSync(path.join(outDir, 'pwa-192x192.png'), generatePng(192, 192, false));
fs.writeFileSync(path.join(outDir, 'pwa-512x512.png'), generatePng(512, 512, false));
fs.writeFileSync(path.join(outDir, 'pwa-maskable-512x512.png'), generatePng(512, 512, true));
fs.writeFileSync(path.join(outDir, 'apple-touch-icon.png'), generatePng(180, 180, false));
fs.writeFileSync(path.join(outDir, 'favicon.ico'), generatePng(32, 32, false));

// Generate SVG icon
const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="pharmG" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0d9488"/>
      <stop offset="100%" stop-color="#10b981"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="128" fill="url(#pharmG)"/>
  <path d="M256 90 L380 145 C380 270 256 390 256 422 C256 390 132 270 132 145 Z" fill="white" opacity="0.15"/>
  <rect x="228" y="160" width="56" height="192" rx="20" fill="white"/>
  <rect x="160" y="228" width="192" height="56" rx="20" fill="white"/>
  <circle cx="360" cy="360" r="32" fill="#34d399"/>
</svg>`;
fs.writeFileSync(path.join(outDir, 'icon.svg'), svgIcon);

console.log('Successfully generated all PWA icons in /public!');
