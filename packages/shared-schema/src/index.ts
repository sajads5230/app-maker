import { AppConfig } from './types/app-config.js';
import { AppConfigSchema } from './validator/zod-schema.js';
import demoConfigJson from './sample/demo-store-config.json';

export * from './types/actions.js';
export * from './types/theme.js';
export * from './types/navigation.js';
export * from './types/blocks.js';
export * from './types/page.js';
export * from './types/app-config.js';
export * from './types/plugins.js';
export * from './validator/zod-schema.js';

/**
 * Validates any JSON object against the AppConfig schema.
 * Throws ZodError if invalid, or returns typed AppConfig if valid.
 */
export function validateAppConfig(input: unknown): AppConfig {
  return AppConfigSchema.parse(input) as AppConfig;
}

/**
 * Safe validation helper returning { success, data, error }
 */
export function safeValidateAppConfig(input: unknown) {
  return AppConfigSchema.safeParse(input);
}

/**
 * Returns the default Iranian Demo Store configuration
 */
export function getDemoAppConfig(): AppConfig {
  return demoConfigJson as unknown as AppConfig;
}
