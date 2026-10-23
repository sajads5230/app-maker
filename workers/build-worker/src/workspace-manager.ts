import fs from 'fs';
import path from 'path';

export interface SandboxOptions {
  preserveOnFailure?: boolean;
}

export class WorkspaceManager {
  private workspacesRoot: string;
  private activeSandboxes: Set<string> = new Set();

  constructor(workerDir: string) {
    this.workspacesRoot = path.resolve(workerDir, 'workspaces');
    if (!fs.existsSync(this.workspacesRoot)) {
      fs.mkdirSync(this.workspacesRoot, { recursive: true });
    }
  }

  /**
   * Cleans any orphaned workspaces from previous worker crashes or restarts
   */
  public cleanOrphanedWorkspaces(): void {
    if (!fs.existsSync(this.workspacesRoot)) return;

    try {
      const items = fs.readdirSync(this.workspacesRoot);
      for (const item of items) {
        const itemPath = path.join(this.workspacesRoot, item);
        try {
          fs.rmSync(itemPath, { recursive: true, force: true });
          console.log(`[WorkspaceManager] Cleaned up orphaned workspace: ${item}`);
        } catch (err) {
          console.warn(`[WorkspaceManager] Could not clean orphaned workspace ${item}:`, err);
        }
      }
    } catch (_) {}
  }

  /**
   * Creates an isolated ephemeral workspace for a build job by copying the master template
   */
  public async createSandbox(jobId: string, masterTemplateDir: string): Promise<string> {
    const sandboxDir = path.join(this.workspacesRoot, `build-${jobId}`);

    if (fs.existsSync(sandboxDir)) {
      await this.cleanupSandbox(sandboxDir);
    }

    fs.mkdirSync(sandboxDir, { recursive: true });
    console.log(`[WorkspaceManager] Initializing isolated sandbox for job ${jobId} at: ${sandboxDir}`);

    // Fast copy master template excluding heavy/transient folders
    const ignoredDirs = new Set(['build', '.dart_tool', '.idea', '.gradle', '.git']);
    const ignoredFiles = new Set(['key.properties', 'app-release.apk', 'app-release.aab']);

    fs.cpSync(masterTemplateDir, sandboxDir, {
      recursive: true,
      filter: (src: string) => {
        const base = path.basename(src);
        if (ignoredDirs.has(base) || ignoredFiles.has(base)) {
          return false;
        }
        return true;
      },
    });

    this.activeSandboxes.add(jobId);
    console.log(`[WorkspaceManager] Sandbox initialized successfully (${this.activeSandboxes.size} active build(s)).`);
    return sandboxDir;
  }

  /**
   * Safely deletes the ephemeral sandbox directory after job completion
   */
  public async cleanupSandbox(sandboxDir: string): Promise<void> {
    // Security check: ensure sandboxDir is inside workspacesRoot
    const normalizedTarget = path.resolve(sandboxDir);
    const normalizedRoot = path.resolve(this.workspacesRoot);

    if (!normalizedTarget.startsWith(normalizedRoot) || normalizedTarget === normalizedRoot) {
      console.error(`[WorkspaceManager] Refusing to delete path outside workspacesRoot: ${sandboxDir}`);
      return;
    }

    if (!fs.existsSync(sandboxDir)) {
      return;
    }

    console.log(`[WorkspaceManager] Cleaning up ephemeral sandbox: ${path.basename(sandboxDir)}...`);

    // Retry loop for Windows file handles
    let attempts = 0;
    while (attempts < 3) {
      try {
        fs.rmSync(sandboxDir, { recursive: true, force: true });
        break;
      } catch (err) {
        attempts++;
        if (attempts >= 3) {
          console.warn(`[WorkspaceManager] Warning: could not immediately delete sandbox ${sandboxDir}:`, err);
        } else {
          await new Promise((resolve) => setTimeout(resolve, 300));
        }
      }
    }

    const jobId = path.basename(sandboxDir).replace(/^build-/, '');
    this.activeSandboxes.delete(jobId);
  }

  public getActiveCount(): number {
    return this.activeSandboxes.size;
  }
}
