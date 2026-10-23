import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function exportData() {
  console.log('📦 Starting data export from active database...');
  const startTime = Date.now();

  try {
    const users = await prisma.user.findMany({
      include: {
        projects: {
          include: {
            buildJobs: true,
          },
        },
        subscriptions: true,
      },
    });

    const exportPath = path.resolve(__dirname, '../prisma/data-snapshot.json');
    fs.writeFileSync(exportPath, JSON.stringify(users, null, 2), 'utf-8');

    let totalProjects = 0;
    let totalSubs = 0;
    let totalJobs = 0;

    users.forEach((u) => {
      totalProjects += u.projects.length;
      totalSubs += u.subscriptions.length;
      u.projects.forEach((p) => {
        totalJobs += p.buildJobs.length;
      });
    });

    console.log(`✅ Data export completed in ${Date.now() - startTime}ms:`);
    console.log(`   - Users:         ${users.length}`);
    console.log(`   - Projects:      ${totalProjects}`);
    console.log(`   - Subscriptions: ${totalSubs}`);
    console.log(`   - BuildJobs:     ${totalJobs}`);
    console.log(`   - Destination:   ${exportPath}`);
  } catch (error) {
    console.error('❌ Data export failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

exportData();
