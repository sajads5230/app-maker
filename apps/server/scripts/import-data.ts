import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function importData() {
  console.log('🚀 Starting data import into target database...');
  const snapshotPath = path.resolve(__dirname, '../prisma/data-snapshot.json');

  if (!fs.existsSync(snapshotPath)) {
    console.error(`❌ Snapshot file not found at: ${snapshotPath}`);
    console.error(`Please run "npm run db:export" first.`);
    process.exit(1);
  }

  const raw = fs.readFileSync(snapshotPath, 'utf-8');
  const users = JSON.parse(raw);
  const startTime = Date.now();

  let importedUsers = 0;
  let importedProjects = 0;
  let importedSubs = 0;
  let importedJobs = 0;

  try {
    for (const u of users) {
      await prisma.user.upsert({
        where: { id: u.id },
        update: {
          phone: u.phone,
          name: u.name,
          role: u.role,
        },
        create: {
          id: u.id,
          phone: u.phone,
          name: u.name,
          role: u.role,
          createdAt: new Date(u.createdAt),
          updatedAt: new Date(u.updatedAt),
        },
      });
      importedUsers++;

      // Subscriptions
      for (const s of u.subscriptions || []) {
        await prisma.subscription.upsert({
          where: { id: s.id },
          update: {
            plan: s.plan,
            status: s.status,
            price: s.price,
            expiresAt: new Date(s.expiresAt),
          },
          create: {
            id: s.id,
            userId: u.id,
            plan: s.plan,
            status: s.status,
            price: s.price,
            expiresAt: new Date(s.expiresAt),
            createdAt: new Date(s.createdAt),
          },
        });
        importedSubs++;
      }

      // Projects
      for (const p of u.projects || []) {
        await prisma.project.upsert({
          where: { id: p.id },
          update: {
            name: p.name,
            packageName: p.packageName,
            version: p.version,
            configJson: p.configJson,
            keystoreSha256: p.keystoreSha256,
          },
          create: {
            id: p.id,
            userId: u.id,
            name: p.name,
            packageName: p.packageName,
            version: p.version,
            configJson: p.configJson,
            keystoreSha256: p.keystoreSha256,
            createdAt: new Date(p.createdAt),
            updatedAt: new Date(p.updatedAt),
          },
        });
        importedProjects++;

        // BuildJobs
        for (const b of p.buildJobs || []) {
          await prisma.buildJob.upsert({
            where: { id: b.id },
            update: {
              platform: b.platform,
              status: b.status,
              downloadUrl: b.downloadUrl,
              aabUrl: b.aabUrl,
              keystoreUrl: b.keystoreUrl,
              logs: b.logs,
            },
            create: {
              id: b.id,
              projectId: p.id,
              platform: b.platform,
              status: b.status,
              downloadUrl: b.downloadUrl,
              aabUrl: b.aabUrl,
              keystoreUrl: b.keystoreUrl,
              logs: b.logs,
              createdAt: new Date(b.createdAt),
              completedAt: b.completedAt ? new Date(b.completedAt) : null,
            },
          });
          importedJobs++;
        }
      }
    }

    console.log(`✅ Data import completed successfully in ${Date.now() - startTime}ms:`);
    console.log(`   - Users imported:         ${importedUsers}`);
    console.log(`   - Subscriptions imported: ${importedSubs}`);
    console.log(`   - Projects imported:      ${importedProjects}`);
    console.log(`   - BuildJobs imported:     ${importedJobs}`);
  } catch (error) {
    console.error('❌ Data import failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

importData();
