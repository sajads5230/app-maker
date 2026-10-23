import fs from 'fs';
import path from 'path';
import { AppIconGenerator } from './icon-generator.js';

export interface AppParameters {
  appName: string;
  packageName: string;
  version: string;
  buildNumber: number;
  configJson: string;
  iconPath?: string;
  splashPath?: string;
  primaryColor?: string;
}

export class AppInjector {
  /**
   * Injects dynamic branding, icons, splash and parameters into the Flutter mobile core project
   */
  static async inject(projectDir: string, params: AppParameters): Promise<void> {
    console.log(`[AppInjector] Injecting parameters for app: ${params.appName} (${params.packageName})...`);

    // 1. Inject JSON Config
    const configPath = path.join(projectDir, 'assets', 'config', 'app_config.json');
    if (fs.existsSync(path.dirname(configPath))) {
      fs.writeFileSync(configPath, params.configJson, 'utf-8');
      console.log(`[AppInjector] Injected app_config.json`);
    }

    // 2. Inject Android App Label in AndroidManifest.xml
    const manifestPath = path.join(projectDir, 'android', 'app', 'src', 'main', 'AndroidManifest.xml');
    if (fs.existsSync(manifestPath)) {
      let manifest = fs.readFileSync(manifestPath, 'utf-8');
      manifest = manifest.replace(
        /android:label="[^"]*"/,
        `android:label="${params.appName}"`
      );
      fs.writeFileSync(manifestPath, manifest, 'utf-8');
      console.log(`[AppInjector] Injected Android App Label: ${params.appName}`);
    }

    // 3. Inject Android Application ID in build.gradle.kts
    const gradlePath = path.join(projectDir, 'android', 'app', 'build.gradle.kts');
    if (fs.existsSync(gradlePath)) {
      let gradle = fs.readFileSync(gradlePath, 'utf-8');
      gradle = gradle.replace(
        /applicationId\s*=\s*"[^"]*"/,
        `applicationId = "${params.packageName}"`
      );
      fs.writeFileSync(gradlePath, gradle, 'utf-8');
      console.log(`[AppInjector] Injected Android ApplicationId: ${params.packageName}`);
    }

    // 4. Inject Version in pubspec.yaml
    const pubspecPath = path.join(projectDir, 'pubspec.yaml');
    if (fs.existsSync(pubspecPath)) {
      let pubspec = fs.readFileSync(pubspecPath, 'utf-8');
      pubspec = pubspec.replace(
        /version:\s*[^\r\n]+/,
        `version: ${params.version}+${params.buildNumber}`
      );
      fs.writeFileSync(pubspecPath, pubspec, 'utf-8');
      console.log(`[AppInjector] Injected Version: ${params.version}+${params.buildNumber}`);
    }

    // 5. Generate & Inject App Icons if an icon is provided or exists in uploads
    if (params.iconPath && fs.existsSync(params.iconPath)) {
      console.log(`[AppInjector] Generating app icons from: ${params.iconPath}...`);
      await AppIconGenerator.generate(params.iconPath, projectDir);
    }

    // 6. Generate & Inject Splash Screen
    if (params.splashPath && fs.existsSync(params.splashPath)) {
      console.log(`[AppInjector] Generating splash screen from: ${params.splashPath}...`);
      await AppIconGenerator.generateSplash(params.splashPath, projectDir, params.primaryColor || '#ffffff');
    }

    console.log(`[AppInjector] Dynamic injection completed successfully!`);
  }
}
