import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
});

export interface DatabaseHealth {
  status: 'UP' | 'DOWN';
  provider: 'postgresql' | 'sqlite' | 'unknown';
  latencyMs: number;
  error?: string;
}

/**
 * Performs a lightweight health check query on the active database connection
 */
export async function checkDatabaseHealth(): Promise<DatabaseHealth> {
  const start = Date.now();
  const dbUrl = process.env.DATABASE_URL || '';
  const provider = dbUrl.startsWith('postgres') ? 'postgresql' : dbUrl.startsWith('file:') ? 'sqlite' : 'unknown';

  try {
    // Perform standard raw ping compatible with both SQLite and PostgreSQL
    await prisma.$queryRaw`SELECT 1`;
    const latencyMs = Date.now() - start;
    return {
      status: 'UP',
      provider,
      latencyMs,
    };
  } catch (err: any) {
    return {
      status: 'DOWN',
      provider,
      latencyMs: Date.now() - start,
      error: err?.message || String(err),
    };
  }
}

// Graceful disconnection on application termination
process.on('SIGTERM', async () => {
  await prisma.$disconnect();
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
});
