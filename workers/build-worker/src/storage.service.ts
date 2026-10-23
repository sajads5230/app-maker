import fs from 'fs';
import path from 'path';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  HeadBucketCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export interface UploadOptions {
  key: string;
  filePath: string;
  contentType: string;
  isPublic?: boolean;
}

export class WorkerStorageService {
  private static instance: WorkerStorageService;
  private s3Client: S3Client | null = null;
  private isS3 = false;
  private bucket: string;
  private endpoint: string;
  private publicCdnUrl?: string;

  private constructor() {
    const hasS3Creds = !!(process.env.S3_ACCESS_KEY && process.env.S3_SECRET_KEY && process.env.S3_BUCKET);
    this.isS3 = process.env.STORAGE_DRIVER === 's3' || hasS3Creds;
    this.bucket = process.env.S3_BUCKET || 'appmaker-storage';
    this.endpoint = process.env.S3_ENDPOINT || 'https://s3.ir-thr-at1.arvanstorage.ir';
    this.publicCdnUrl = process.env.S3_PUBLIC_CDN_URL;

    if (this.isS3 && process.env.S3_ACCESS_KEY && process.env.S3_SECRET_KEY) {
      this.s3Client = new S3Client({
        endpoint: this.endpoint,
        region: process.env.S3_REGION || 'default',
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY,
          secretAccessKey: process.env.S3_SECRET_KEY,
        },
        forcePathStyle: process.env.S3_FORCE_PATH_STYLE !== 'false',
      });
      console.log(`☁️ [WorkerStorage] Connected to S3 Cloud Object Storage (${this.endpoint}/${this.bucket})`);
    } else {
      console.log(`📁 [WorkerStorage] Running in Local Storage Mode (Packages stored in public/downloads)`);
    }
  }

  public static getInstance(): WorkerStorageService {
    if (!WorkerStorageService.instance) {
      WorkerStorageService.instance = new WorkerStorageService();
    }
    return WorkerStorageService.instance;
  }

  /**
   * Uploads compiled APK/AAB/Keystore to S3 or moves to downloads directory
   */
  public async uploadArtifact(options: UploadOptions, downloadsDir: string): Promise<string> {
    const cleanKey = options.key.replace(/^\/+/, '');
    const fileName = path.basename(cleanKey);

    // 1. Always ensure local copy exists in downloadsDir for backwards compatibility & fast local downloads
    const localDest = path.join(downloadsDir, fileName);
    if (path.resolve(options.filePath) !== path.resolve(localDest)) {
      fs.copyFileSync(options.filePath, localDest);
    }

    // 2. If S3 driver is active, upload to Cloud Bucket
    if (this.isS3 && this.s3Client) {
      console.log(`☁️ [WorkerStorage] Uploading ${fileName} (${fs.statSync(options.filePath).size} bytes) to S3 bucket...`);
      const fileBuffer = fs.readFileSync(options.filePath);

      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: `builds/${cleanKey}`,
        Body: fileBuffer,
        ContentType: options.contentType,
        ACL: options.isPublic ? 'public-read' : undefined,
      });

      await this.s3Client.send(command);

      if (this.publicCdnUrl) {
        return `${this.publicCdnUrl.replace(/\/+$/, '')}/builds/${cleanKey}`;
      }

      if (options.isPublic) {
        return `${this.endpoint.replace(/\/+$/, '')}/${this.bucket}/builds/${cleanKey}`;
      }

      // Presigned download link valid for 7 days (604800 seconds)
      const getCommand = new GetObjectCommand({
        Bucket: this.bucket,
        Key: `builds/${cleanKey}`,
      });
      return await getSignedUrl(this.s3Client, getCommand, { expiresIn: 604800 });
    }

    // Default: Local direct download route
    return `/downloads/${fileName}`;
  }
}

export const workerStorage = WorkerStorageService.getInstance();
