import { Jimp } from 'jimp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_DIR = path.resolve(__dirname, '../public/uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

async function createSampleMedia() {
  console.log('Generating initial media library assets...');

  // 1. App Icon (512x512 with gradient/colored background and emblem)
  const appIcon = new Jimp({ width: 512, height: 512, color: 0xef394eff }); // Brand Rose Red
  // Add an inner white rounded box
  for (let x = 96; x < 416; x++) {
    for (let y = 96; y < 416; y++) {
      // Circle or rounded center
      const dx = x - 256;
      const dy = y - 256;
      if (dx * dx + dy * dy < 130 * 130) {
        appIcon.setPixelColor(0xffffffff, x, y);
      }
    }
  }
  // Inner Rose dot
  for (let x = 200; x < 312; x++) {
    for (let y = 200; y < 312; y++) {
      const dx = x - 256;
      const dy = y - 256;
      if (dx * dx + dy * dy < 48 * 48) {
        appIcon.setPixelColor(0xef394eff, x, y);
      }
    }
  }
  await appIcon.write(path.join(UPLOADS_DIR, 'app-icon-techmarket.png'));
  console.log('Created: app-icon-techmarket.png');

  // 2. Banner 1: Special Offers (800x400)
  const banner1 = new Jimp({ width: 800, height: 400, color: 0x1e1b4bff }); // Indigo 950
  for (let x = 0; x < 800; x++) {
    for (let y = 0; y < 400; y++) {
      if ((x + y) % 32 < 2) {
        banner1.setPixelColor(0x312e81ff, x, y);
      }
    }
  }
  await banner1.write(path.join(UPLOADS_DIR, 'banner-special-offers.png'));
  console.log('Created: banner-special-offers.png');

  // 3. Banner 2: Digital Accessories (800x400)
  const banner2 = new Jimp({ width: 800, height: 400, color: 0x0f172aff }); // Slate 900
  for (let x = 0; x < 800; x++) {
    for (let y = 0; y < 400; y++) {
      if (x % 40 === 0 || y % 40 === 0) {
        banner2.setPixelColor(0x1e293bff, x, y);
      }
    }
  }
  await banner2.write(path.join(UPLOADS_DIR, 'banner-accessories.png'));
  console.log('Created: banner-accessories.png');

  // 4. Promo Banner A (500x320)
  const promoA = new Jimp({ width: 500, height: 320, color: 0x064e3bff }); // Emerald 900
  await promoA.write(path.join(UPLOADS_DIR, 'promo-smartwatch.png'));
  console.log('Created: promo-smartwatch.png');

  // 5. Promo Banner B (500x320)
  const promoB = new Jimp({ width: 500, height: 320, color: 0x831843ff }); // Pink 900
  await promoB.write(path.join(UPLOADS_DIR, 'promo-gaming.png'));
  console.log('Created: promo-gaming.png');

  console.log('Media assets generated successfully in', UPLOADS_DIR);
}

createSampleMedia().catch(console.error);
