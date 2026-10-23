import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import fs from 'fs';
import path from 'path';
import { pipeline } from 'stream/promises';
import { AppIconGenerator } from './icon-generator.js';
import { storage } from '../../services/storage.service.js';

export const mediaRoutes: FastifyPluginAsync = async (server: FastifyInstance) => {
  const UPLOADS_DIR = path.resolve(process.cwd(), 'public/uploads');
  const FLUTTER_DIR = path.resolve(process.cwd(), '../../apps/mobile-core');

  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }

  // 1. List all media library assets
  server.get('/api/media', async (request, reply) => {
    try {
      if (!fs.existsSync(UPLOADS_DIR)) {
        return reply.send({ success: true, media: [] });
      }

      const files = fs.readdirSync(UPLOADS_DIR);
      const mediaList = files
        .filter((f) => !f.startsWith('.'))
        .map((filename) => {
          const filePath = path.join(UPLOADS_DIR, filename);
          const stats = fs.statSync(filePath);
          const ext = path.extname(filename).toLowerCase();
          const isIcon = filename.includes('icon') || filename.includes('logo');
          const isBanner = filename.includes('banner') || filename.includes('promo');

          return {
            id: filename,
            filename,
            url: `/uploads/${filename}`,
            size: stats.size,
            ext,
            isIcon,
            isBanner,
            createdAt: stats.ctime,
          };
        })
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      return reply.send({ success: true, media: mediaList });
    } catch (err: any) {
      server.log.error(err);
      return reply.status(500).send({ success: false, error: 'خطا در واکشی مدیا' });
    }
  });

  // 2. Upload file
  server.post('/api/media/upload', async (request, reply) => {
    try {
      const data = await request.file();
      if (!data) {
        return reply.status(400).send({ success: false, error: 'فایلی جهت آپلود ارسال نشده است.' });
      }

      // Check allowed image mimetypes
      const allowedMimes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml'];
      if (!allowedMimes.includes(data.mimetype)) {
        return reply.status(400).send({
          success: false,
          error: 'فرمت فایل مجاز نیست. لطفاً تصویر PNG، JPG یا WebP ارسال فرمایید.',
        });
      }

      const timestamp = Date.now();
      const sanitizedName = data.filename.replace(/[^a-zA-Z0-9._-]/g, '_');
      const filename = `${timestamp}-${sanitizedName}`;
      const targetPath = path.join(UPLOADS_DIR, filename);

      await pipeline(data.file, fs.createWriteStream(targetPath));

      const stats = fs.statSync(targetPath);

      // Upload to Cloud S3 Storage or Local Storage
      const uploaded = await storage.uploadFile({
        key: `uploads/${filename}`,
        filePath: targetPath,
        contentType: data.mimetype,
        isPublic: true,
      });

      return reply.send({
        success: true,
        message: 'فایل با موفقیت در ذخیره‌ساز بارگذاری شد.',
        file: {
          id: filename,
          filename,
          url: uploaded.url,
          size: stats.size,
          mimetype: data.mimetype,
          createdAt: stats.ctime,
        },
      });
    } catch (err: any) {
      server.log.error(err);
      return reply.status(500).send({ success: false, error: 'خطا در بارگذاری فایل' });
    }
  });

  // 3. Automated Icon Generator Trigger
  server.post('/api/media/generate-icons', async (request, reply) => {
    const { filename, primaryColor } = request.body as { filename: string; primaryColor?: string };
    if (!filename) {
      return reply.status(400).send({ success: false, error: 'نام فایل لوگو ارسال نشده است.' });
    }

    const sourcePath = path.join(UPLOADS_DIR, filename);
    if (!fs.existsSync(sourcePath)) {
      return reply.status(404).send({ success: false, error: 'فایل در کتابخانه رسانه یافت نشد.' });
    }

    const result = await AppIconGenerator.generate(sourcePath, FLUTTER_DIR);
    if (primaryColor) {
      await AppIconGenerator.generateSplash(sourcePath, FLUTTER_DIR, primaryColor);
    }

    if (!result.success) {
      return reply.status(500).send({ success: false, error: result.error });
    }

    return reply.send({
      success: true,
      message: `آیکون‌های اپلیکیشن برای اندروید و وب با موفقیت تولید و جایگزین شدند (${result.generatedFiles.length} فایل).`,
      generatedCount: result.generatedFiles.length,
    });
  });

  // 4. Delete media item
  server.delete('/api/media/:filename', async (request, reply) => {
    const { filename } = request.params as { filename: string };
    const targetPath = path.join(UPLOADS_DIR, filename);

    if (fs.existsSync(targetPath)) {
      fs.unlinkSync(targetPath);
      return reply.send({ success: true, message: 'فایل با موفقیت حذف شد.' });
    } else {
      return reply.status(404).send({ success: false, error: 'فایل یافت نشد.' });
    }
  });
};
