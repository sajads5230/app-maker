import fs from 'fs';
import path from 'path';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  HeadBucketCommand,
  ListObjectsV2Command,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export interface StorageConfig {
  driver: 's3' | 'local';
  endpoint?: string;
  region?: string;
  bucket?: string;
  accessKey?: string;
  secretKey?: string;
  forcePathStyle?: boolean;
  publicCdnUrl?: string;
}

export interface UploadOptions {
  key: string;
  filePath?: string;
  buffer?: Buffer;
  contentType: string;
  isPublic?: boolean;
}

export interface StorageHealth {
  status: 'UP' | 'DOWN';
  driver: 's3' | 'local';
  bucket?: string;
  latencyMs: number;
  error?: string;
}

export class StorageService {
  private static instance: StorageService;
  private s3Client: S3Client | null = null;
  private config: StorageConfig;
  private uploadsDir: string;
  private downloadsDir: string;

  private constructor() {
    this.uploadsDir = path.resolve(process.cwd(), 'public/uploads');
    this.downloadsDir = path.resolve(process.cwd(), 'public/downloads');

    if (!fs.existsSync(this.uploadsDir)) fs.mkdirSync(this.uploadsDir, { recursive: true });
    if (!fs.existsSync(this.downloadsDir)) fs.mkdirSync(this.downloadsDir, { recursive: true });

    const hasS3Creds = !!(process.env.S3_ACCESS_KEY && process.env.S3_SECRET_KEY && process.env.S3_BUCKET);
    const driver = process.env.STORAGE_DRIVER === 's3' || hasS3Creds ? 's3' : 'local';

    this.config = {
      driver,
      endpoint: process.env.S3_ENDPOINT || 'https://s3.ir-thr-at1.arvanstorage.ir',
      region: process.env.S3_REGION || 'default',
      bucket: process.env.S3_BUCKET || 'appmaker-storage',
      accessKey: process.env.S3_ACCESS_KEY,
      secretKey: process.env.S3_SECRET_KEY,
      forcePathStyle: process.env.S3_FORCE_PATH_STYLE !== 'false', // default true for ArvanCloud & MinIO
      publicCdnUrl: process.env.S3_PUBLIC_CDN_URL,
    };

    if (this.config.driver === 's3' && this.config.accessKey && this.config.secretKey) {
      this.s3Client = new S3Client({
        endpoint: this.config.endpoint,
        region: this.config.region,
        credentials: {
          accessKeyId: this.config.accessKey,
          secretAccessKey: this.config.secretKey,
        },
        forcePathStyle: this.config.forcePathStyle,
      });
      console.log(`☁️ [StorageService] Initialized S3 Cloud Object Storage driver (Endpoint: ${this.config.endpoint}, Bucket: ${this.config.bucket})`);
    } else {
      console.log(`📁 [StorageService] Initialized Local Disk Storage driver (Fallback mode: /public/uploads and /public/downloads)`);
    }
  }

  public static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  public getConfig(): StorageConfig {
    return { ...this.config };
  }

  /**
   * Uploads a local file or buffer to the active storage driver (S3 Cloud or Local Disk)
   */
  public async uploadFile(options: UploadOptions): Promise<{ url: string; key: string }> {
    const key = options.key.replace(/^\/+/, '');

    if (this.config.driver === 's3' && this.s3Client && this.config.bucket) {
      const fileBody = options.buffer ? options.buffer : fs.readFileSync(options.filePath!);

      const command = new PutObjectCommand({
        Bucket: this.config.bucket,
        Key: key,
        Body: fileBody,
        ContentType: options.contentType,
        ACL: options.isPublic ? 'public-read' : undefined,
      });

      await this.s3Client.send(command);

      // If a custom CDN domain is provided, use it; otherwise generate public or presigned URL
      if (this.config.publicCdnUrl) {
        return {
          url: `${this.config.publicCdnUrl.replace(/\/+$/, '')}/${key}`,
          key,
        };
      }

      if (options.isPublic) {
        const publicUrl = `${this.config.endpoint?.replace(/\/+$/, '')}/${this.config.bucket}/${key}`;
        return { url: publicUrl, key };
      }

      // Default: presigned URL valid for 48 hours (172800 seconds)
      const presignedUrl = await this.getPresignedDownloadUrl(key, 172800);
      return { url: presignedUrl, key };
    }

    // Local Disk Fallback
    const isDownload = key.startsWith('downloads/') || key.endsWith('.apk') || key.endsWith('.aab') || key.endsWith('.jks');
    const targetFolder = isDownload ? this.downloadsDir : this.uploadsDir;
    const cleanFileName = path.basename(key);
    const destPath = path.join(targetFolder, cleanFileName);

    if (options.filePath && fs.existsSync(options.filePath)) {
      if (path.resolve(options.filePath) !== path.resolve(destPath)) {
        fs.copyFileSync(options.filePath, destPath);
      }
    } else if (options.buffer) {
      fs.writeFileSync(destPath, options.buffer);
    }

    const localUrl = isDownload ? `/downloads/${cleanFileName}` : `/uploads/${cleanFileName}`;
    return { url: localUrl, key };
  }

  /**
   * Generates a secure, temporary pre-signed download URL for private S3 objects
   */
  public async getPresignedDownloadUrl(key: string, expiresInSeconds = 86400): Promise<string> {
    if (this.config.driver === 's3' && this.s3Client && this.config.bucket) {
      const command = new GetObjectCommand({
        Bucket: this.config.bucket,
        Key: key,
      });
      return await getSignedUrl(this.s3Client, command, { expiresIn: expiresInSeconds });
    }

    // Local Fallback
    const isDownload = key.startsWith('downloads/') || key.endsWith('.apk') || key.endsWith('.aab') || key.endsWith('.jks');
    const cleanFileName = path.basename(key);
    return isDownload ? `/downloads/${cleanFileName}` : `/uploads/${cleanFileName}`;
  }

  /**
   * Deletes an object from the active storage driver
   */
  public async deleteFile(key: string): Promise<void> {
    if (this.config.driver === 's3' && this.s3Client && this.config.bucket) {
      const command = new DeleteObjectCommand({
        Bucket: this.config.bucket,
        Key: key,
      });
      await this.s3Client.send(command);
      return;
    }

    // Local
    const isDownload = key.startsWith('downloads/');
    const destPath = path.join(isDownload ? this.downloadsDir : this.uploadsDir, path.basename(key));
    if (fs.existsSync(destPath)) {
      fs.unlinkSync(destPath);
    }
  }

  /**
   * Checks health and connection latency of the active storage driver
   */
  public async checkHealth(): Promise<StorageHealth> {
    const start = Date.now();

    if (this.config.driver === 's3' && this.s3Client && this.config.bucket) {
      try {
        const command = new HeadBucketCommand({ Bucket: this.config.bucket });
        await this.s3Client.send(command);
        return {
          status: 'UP',
          driver: 's3',
          bucket: this.config.bucket,
          latencyMs: Date.now() - start,
        };
      } catch (err: any) {
        return {
          status: 'DOWN',
          driver: 's3',
          bucket: this.config.bucket,
          latencyMs: Date.now() - start,
          error: err?.message || String(err),
        };
      }
    }

    // Local disk check
    try {
      const testFile = path.join(this.uploadsDir, '.health_check');
      fs.writeFileSync(testFile, 'ok', 'utf-8');
      fs.unlinkSync(testFile);
      return {
        status: 'UP',
        driver: 'local',
        latencyMs: Date.now() - start,
      };
    } catch (err: any) {
      return {
        status: 'DOWN',
        driver: 'local',
        latencyMs: Date.now() - start,
        error: err?.message || String(err),
      };
    }
  }
}

export const storage = StorageService.getInstance();
