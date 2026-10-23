import { AppIconGenerator } from '../dist/modules/media/icon-generator.js';
import path from 'path';

async function main() {
  const iconPath = 'E:/project/App Maker/apps/server/public/uploads/app-icon-techmarket.png';
  const flutterDir = 'E:/project/App Maker/apps/mobile-core';

  console.log('Testing AppIconGenerator...');
  const res = await AppIconGenerator.generate(iconPath, flutterDir);
  console.log('Generate Result:', res.success, 'Files:', res.generatedFiles.length);

  const splashRes = await AppIconGenerator.generateSplash(iconPath, flutterDir, '#ef394e');
  console.log('Splash Result:', splashRes);
}

main().catch(console.error);
