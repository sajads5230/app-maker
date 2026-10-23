import { APPETO_PLUGIN_CATALOG, AppetoPluginDef, ActiveProjectPlugin } from '@app-maker/shared-schema';
import { prisma } from '../../prisma.js';

export class PluginsService {
  public static getCatalog(): AppetoPluginDef[] {
    return APPETO_PLUGIN_CATALOG;
  }

  public static async getProjectPlugins(projectId: string): Promise<Record<string, ActiveProjectPlugin>> {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new Error('پروژه یافت نشد.');
    }

    let config: any = {};
    try {
      config = JSON.parse(project.configJson);
    } catch (_) {}

    // Initialize with default Iranian app plugins if not present
    if (!config.plugins) {
      config.plugins = {
        woocommerce: {
          enabled: true,
          settings: APPETO_PLUGIN_CATALOG.find((p) => p.id === 'woocommerce')?.defaultSettings || {},
          updatedAt: new Date().toISOString(),
        },
        wallet: {
          enabled: true,
          settings: APPETO_PLUGIN_CATALOG.find((p) => p.id === 'wallet')?.defaultSettings || {},
          updatedAt: new Date().toISOString(),
        },
        goftino_chat: {
          enabled: true,
          settings: APPETO_PLUGIN_CATALOG.find((p) => p.id === 'goftino_chat')?.defaultSettings || {},
          updatedAt: new Date().toISOString(),
        },
        ai_assistant: {
          enabled: true,
          settings: APPETO_PLUGIN_CATALOG.find((p) => p.id === 'ai_assistant')?.defaultSettings || {},
          updatedAt: new Date().toISOString(),
        },
        barcode_scanner: {
          enabled: true,
          settings: APPETO_PLUGIN_CATALOG.find((p) => p.id === 'barcode_scanner')?.defaultSettings || {},
          updatedAt: new Date().toISOString(),
        },
        force_update: {
          enabled: true,
          settings: APPETO_PLUGIN_CATALOG.find((p) => p.id === 'force_update')?.defaultSettings || {},
          updatedAt: new Date().toISOString(),
        },
        contact_us: {
          enabled: true,
          settings: APPETO_PLUGIN_CATALOG.find((p) => p.id === 'contact_us')?.defaultSettings || {},
          updatedAt: new Date().toISOString(),
        },
      };

      // Persist defaults back to project
      await prisma.project.update({
        where: { id: projectId },
        data: { configJson: JSON.stringify(config, null, 2) },
      });
    }

    return config.plugins;
  }

  public static async togglePlugin(
    projectId: string,
    pluginId: string,
    enabledState?: boolean
  ): Promise<ActiveProjectPlugin> {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new Error('پروژه یافت نشد.');
    }

    let config: any = {};
    try {
      config = JSON.parse(project.configJson);
    } catch (_) {}

    if (!config.plugins) {
      config.plugins = {};
    }

    const pluginDef = APPETO_PLUGIN_CATALOG.find((p) => p.id === pluginId);
    if (!pluginDef) {
      throw new Error(`ماژول با شناسه ${pluginId} یافت نشد.`);
    }

    const current = config.plugins[pluginId];
    const newEnabled = enabledState !== undefined ? enabledState : !current?.enabled;

    config.plugins[pluginId] = {
      enabled: newEnabled,
      settings: current?.settings || pluginDef.defaultSettings,
      updatedAt: new Date().toISOString(),
    };

    await prisma.project.update({
      where: { id: projectId },
      data: { configJson: JSON.stringify(config, null, 2) },
    });

    return config.plugins[pluginId];
  }

  public static async updatePluginSettings(
    projectId: string,
    pluginId: string,
    settings: Record<string, any>
  ): Promise<ActiveProjectPlugin> {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new Error('پروژه یافت نشد.');
    }

    let config: any = {};
    try {
      config = JSON.parse(project.configJson);
    } catch (_) {}

    if (!config.plugins) {
      config.plugins = {};
    }

    const pluginDef = APPETO_PLUGIN_CATALOG.find((p) => p.id === pluginId);
    if (!pluginDef) {
      throw new Error(`ماژول با شناسه ${pluginId} یافت نشد.`);
    }

    const current = config.plugins[pluginId];

    config.plugins[pluginId] = {
      enabled: current ? current.enabled : true,
      settings: {
        ...(current?.settings || pluginDef.defaultSettings),
        ...settings,
      },
      updatedAt: new Date().toISOString(),
    };

    await prisma.project.update({
      where: { id: projectId },
      data: { configJson: JSON.stringify(config, null, 2) },
    });

    return config.plugins[pluginId];
  }
}
