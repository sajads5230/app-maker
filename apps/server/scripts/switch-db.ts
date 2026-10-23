import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const target = (process.argv[2] || '').toLowerCase();
const prismaDir = path.resolve(__dirname, '../prisma');

if (target !== 'postgres' && target !== 'postgresql' && target !== 'sqlite') {
  console.log('Usage: npx tsx scripts/switch-db.ts <postgres|sqlite>');
  process.exit(1);
}

const isPostgres = target === 'postgres' || target === 'postgresql';
const sourceFile = isPostgres ? 'schema.postgresql.prisma' : 'schema.sqlite.prisma';
const targetFile = 'schema.prisma';

const sourcePath = path.join(prismaDir, sourceFile);
const targetPath = path.join(prismaDir, targetFile);

if (!fs.existsSync(sourcePath)) {
  console.error(`Source schema file not found: ${sourcePath}`);
  process.exit(1);
}

fs.copyFileSync(sourcePath, targetPath);

console.log(`✅ Switched active Prisma schema to: ${isPostgres ? 'PostgreSQL (Production)' : 'SQLite (Local)'}`);
console.log(`   Source: ${sourceFile} -> Destination: ${targetFile}`);
console.log(`\nNext steps:`);
if (isPostgres) {
  console.log(`   1. Set DATABASE_URL in your .env to your PostgreSQL connection string.`);
  console.log(`   2. Run "npm run prisma:push" to synchronize the database schema.`);
  console.log(`   3. Run "npm run db:import" if you wish to restore existing SQLite data.`);
} else {
  console.log(`   1. Ensure DATABASE_URL="file:./dev.db" in your .env.`);
  console.log(`   2. Run "npm run prisma:push" to synchronize the database schema.`);
}
