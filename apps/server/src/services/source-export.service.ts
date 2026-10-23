import fs from 'fs';
import path from 'path';
import archiver from 'archiver';
import { prisma } from '../prisma.js';

export interface SourceExportResult {
  success: boolean;
  fileName: string;
  downloadUrl: string;
  sizeBytes: number;
  packageName: string;
  generatedAt: string;
}

export class SourceExportService {
  /**
   * Locates the mobile-core master template directory
   */
  private static getTemplateDir(): string {
    const candidates = [
      path.resolve(process.cwd(), '../mobile-core'),
      path.resolve(process.cwd(), 'apps/mobile-core'),
      path.resolve(process.cwd(), '../../apps/mobile-core'),
    ];

    for (const dir of candidates) {
      if (fs.existsSync(path.join(dir, 'pubspec.yaml')) && fs.existsSync(path.join(dir, 'lib'))) {
        return dir;
      }
    }

    throw new Error('فولدر قالب اصلی فلاتر (apps/mobile-core) در سرور یافت نشد.');
  }

  /**
   * Generates a fully unlocked, customized Flutter project ZIP archive
   */
  public static async exportProjectSource(projectId: string): Promise<SourceExportResult> {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new Error(`پروژه با شناسه ${projectId} یافت نشد.`);
    }

    const templateDir = this.getTemplateDir();
    const downloadsDir = path.resolve(process.cwd(), 'public/downloads');
    if (!fs.existsSync(downloadsDir)) {
      fs.mkdirSync(downloadsDir, { recursive: true });
    }

    const safePkg = project.packageName.replace(/[^a-zA-Z0-9_.-]/g, '_');
    const zipFileName = `${safePkg}-flutter-source.zip`;
    const zipFilePath = path.join(downloadsDir, zipFileName);

    // Prepare customized file contents
    const configContent = project.configJson || '{}';

    // Customized AndroidManifest.xml
    const manifestPath = path.join(templateDir, 'android', 'app', 'src', 'main', 'AndroidManifest.xml');
    let customManifest = fs.existsSync(manifestPath) ? fs.readFileSync(manifestPath, 'utf-8') : '';
    if (customManifest) {
      customManifest = customManifest.replace(/android:label="[^"]*"/, `android:label="${project.name}"`);
    }

    // Customized build.gradle.kts
    const gradlePath = path.join(templateDir, 'android', 'app', 'build.gradle.kts');
    let customGradle = fs.existsSync(gradlePath) ? fs.readFileSync(gradlePath, 'utf-8') : '';
    if (customGradle) {
      customGradle = customGradle.replace(/applicationId\s*=\s*"[^"]*"/, `applicationId = "${project.packageName}"`);
    }

    // Customized README.md for developer handoff
    const customReadme = `# سورس کد فلاتر اپلیکیشن ${project.name} (${project.packageName})

این پکیج سورس‌کد کامل، استاندارد و بدون وابستگی انحصاری (Zero Vendor Lock-in) اپلیکیشن شماست که توسط موتور **App Maker** خروجی گرفته شده است.

---

## 🚀 مشخصات پروژه
- **نام اپلیکیشن:** ${project.name}
- **شناسه پکیج (Package Name):** \`${project.packageName}\`
- **نسخه:** \`${project.version || '1.0.0'}\`
- **معماری:** Server-Driven UI (فلاتر ماژولار با قابلیت بروزرسانی آنی چیدمان بدون انتشار نسخه جدید)
- **فناوری:** Flutter 3.24+ / Dart 3.5+

---

## 💻 راهنمای اجرا در محیط توسعه (Local Setup)

### ۱. پیش‌نیازها
- نصب [Flutter SDK](https://flutter.dev/docs/get-started/install) نسخه ۳.۲۴ به بالا
- نصب Android Studio یا VS Code با افزونه Flutter & Dart
- راه‌اندازی شبیه‌ساز (Emulator) یا اتصال گوشی فیزیکی با Android Debugging فعال

### ۲. دریافت وابستگی‌ها
دستور زیر را در ترمینال پوشه پروژه اجرا کنید:
\`\`\`bash
flutter pub get
\`\`\`

### ۳. اجرای برنامه در حالت توسعه (Debug Mode)
\`\`\`bash
flutter run
\`\`\`

### ۴. ساخت فایل نصبی انتشار (Release APK & AAB)
برای ساخت فایل نصبی بهینه‌شده APK:
\`\`\`bash
flutter build apk --release
\`\`\`
فایل خروجی در مسیر \`build/app/outputs/flutter-apk/app-release.apk\` قرار می‌گیرد.

برای ساخت باندل انتشار کافه‌بازار، مایکت و گوگل‌پلی (AAB):
\`\`\`bash
flutter build appbundle --release
\`\`\`
فایل خروجی در مسیر \`build/app/outputs/bundle/release/app-release.aab\` قرار خواهد گرفت.

---

## 📁 ساختار پوشه‌های پروژه
- \`lib/core/\`: سرویس‌های شبکه (Dio)، کش آفلاین محلی (Hive/SharedPreferences)، مبدل زبان و ارز، و اعتبارسنجی
- \`lib/models/\`: مدل‌های داده چیدمان (LayoutConfig, BlockConfig)، محصولات و سفارشات
- \`lib/providers/\`: مدیریت وضعیت با StateNotifier و Riverpod
- \`lib/screens/\`: صفحات اصلی برنامه (فروشگاه، سبد خرید، پروفایل، لندینگ، درگاه پرداخت)
- \`lib/widgets/\`: بلوک‌های ویجت Server-Driven UI (اسلایدر، محصولات، رزرواسیون، فرم B2B، دوره آموزشی، تبلیغات عدد/تپسل، شیت پشتیبانی چندکاناله)
- \`assets/config/app_config.json\`: کانفیگ محلی ذخیره‌شده اپلیکیشن برای اجرای بدون نیاز به اینترنت در اولین اجرا

---

## 🔒 مالکیت سورس کد و شخصی‌سازی
این سورس‌کد ۱۰۰٪ متعلق به شماست و می‌توانید هرگونه تغییر دلخواه، افزودن کتابخانه‌های نیتیو، سیستم‌های هوش مصنوعی یا درگاه‌های پرداخت سفارشی را روی آن پیاده‌سازی و در هر مارکتی منتشر کنید.

*ساخته شده با پلتفرم هوشمند App Maker*
`;

    // Archiving setup
    return new Promise((resolve, reject) => {
      const output = fs.createWriteStream(zipFilePath);
      const rawArchiver: any = archiver;
      const ZipClass = rawArchiver.ZipArchive || (typeof rawArchiver === 'function' ? rawArchiver : null);

      if (!ZipClass) {
        throw new Error('کلاس ساخت آرشیو زیپ (ZipArchive) در پکیج یافت نشد.');
      }

      const zipArchiver = rawArchiver.ZipArchive
        ? new rawArchiver.ZipArchive({ zlib: { level: 9 } })
        : rawArchiver('zip', { zlib: { level: 9 } });

      output.on('close', () => {
        const stats = fs.statSync(zipFilePath);
        console.log(`[SourceExportService] Successfully created source ZIP: ${zipFileName} (${stats.size} bytes)`);
        resolve({
          success: true,
          fileName: zipFileName,
          downloadUrl: `/downloads/${zipFileName}`,
          sizeBytes: stats.size,
          packageName: project.packageName,
          generatedAt: new Date().toISOString(),
        });
      });

      zipArchiver.on('error', (err: any) => {
        console.error('[SourceExportService] Archive error:', err);
        reject(err);
      });

      zipArchiver.pipe(output);

      const ignoredDirectories = new Set([
        'build',
        '.dart_tool',
        '.idea',
        '.gradle',
        '.git',
        '.vscode',
        'node_modules',
      ]);

      const ignoredFiles = new Set([
        'key.properties',
        'release-keystore.jks',
      ]);

      // Recursive directory walker
      function addDirectoryToArchive(currentDir: string, archivePrefix: string) {
        const entries = fs.readdirSync(currentDir, { withFileTypes: true });

        for (const entry of entries) {
          const fullPath = path.join(currentDir, entry.name);
          const relativeArchiveEntry = path.posix.join(archivePrefix, entry.name);

          if (entry.isDirectory()) {
            if (ignoredDirectories.has(entry.name)) {
              continue;
            }
            addDirectoryToArchive(fullPath, relativeArchiveEntry);
          } else if (entry.isFile()) {
            if (ignoredFiles.has(entry.name) || entry.name.endsWith('.jks') || entry.name.endsWith('.keystore')) {
              continue;
            }

            // Intercept customized files
            if (relativeArchiveEntry === 'assets/config/app_config.json') {
              zipArchiver.append(configContent, { name: relativeArchiveEntry });
            } else if (relativeArchiveEntry === 'android/app/src/main/AndroidManifest.xml' && customManifest) {
              zipArchiver.append(customManifest, { name: relativeArchiveEntry });
            } else if (relativeArchiveEntry === 'android/app/build.gradle.kts' && customGradle) {
              zipArchiver.append(customGradle, { name: relativeArchiveEntry });
            } else if (relativeArchiveEntry === 'README.md') {
              zipArchiver.append(customReadme, { name: relativeArchiveEntry });
            } else {
              zipArchiver.file(fullPath, { name: relativeArchiveEntry });
            }
          }
        }
      }

      addDirectoryToArchive(templateDir, '');
      zipArchiver.finalize();
    });
  }
}
