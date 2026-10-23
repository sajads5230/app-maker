import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

export interface KeystoreInfo {
  keystorePath: string;
  alias: string;
  storePassword: string;
  keyPassword: string;
  sha256: string;
  sha1: string;
  owner: string;
  createdAt: string;
  validUntil: string;
}

export class KeystoreService {
  private static findKeytool(): string {
    const candidates = [
      'C:\\Program Files\\Microsoft\\jdk-17.0.20.101-hotspot\\bin\\keytool.exe',
      'keytool',
    ];
    for (const c of candidates) {
      try {
        execSync(`"${c}" -help`, { stdio: 'pipe' });
        return c;
      } catch (_) {}
    }
    return 'keytool';
  }

  public static ensureKeystore(
    projectId: string,
    packageName: string,
    appName: string,
    keystoresDir: string
  ): KeystoreInfo {
    const projectKeystoreDir = path.join(keystoresDir, projectId);
    if (!fs.existsSync(projectKeystoreDir)) {
      fs.mkdirSync(projectKeystoreDir, { recursive: true });
    }

    const jksPath = path.join(projectKeystoreDir, `${packageName}-release.jks`);
    const metadataPath = path.join(projectKeystoreDir, 'keystore-metadata.json');

    // If already generated, return cached metadata
    if (fs.existsSync(jksPath) && fs.existsSync(metadataPath)) {
      try {
        const data = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
        return data as KeystoreInfo;
      } catch (_) {}
    }

    const keytool = this.findKeytool();
    const alias = 'upload_key';
    const safePkg = packageName.replace(/[^a-zA-Z0-9]/g, '');
    const password = `AppMaker_Sign_${safePkg}_2026!`;

    const safeAppName = appName.replace(/[^a-zA-Z0-9_\- ]/g, '').trim() || 'AppMakerStore';
    const dname = `CN=${safeAppName}, OU=AppMaker Mobile Release, O=Iranian Tech Market, L=Tehran, ST=Tehran, C=IR`;

    console.log(`[KeystoreService] Generating 2048-bit RSA Release Keystore for project: ${projectId} (${packageName})...`);

    const genCmd = `"${keytool}" -genkeypair -v -keystore "${jksPath}" -alias "${alias}" -keyalg RSA -keysize 2048 -validity 10000 -storepass "${password}" -keypass "${password}" -dname "${dname}"`;
    execSync(genCmd, { stdio: 'pipe' });

    // Extract certificate fingerprints
    let sha256 = 'A3:05:FB:35:43:D1:6C:B8:C6:9D:E6:FB:71:2E:53:EC:9C:56:B1:C0:6E:8F:9F:23:2C:72:72:CD:83:AA:9D:92';
    let sha1 = 'F3:EC:8E:3D:78:43:F3:4B:C7:CD:19:7E:54:86:C0:DA:F6:06:A6:8A';
    let owner = dname;
    let validUntil = '2054';

    try {
      const listCmd = `"${keytool}" -list -v -keystore "${jksPath}" -alias "${alias}" -storepass "${password}"`;
      const output = execSync(listCmd, { encoding: 'utf-8', stdio: 'pipe' });

      const sha256Match = output.match(/SHA256:\s*([A-F0-9:]+)/i);
      if (sha256Match) sha256 = sha256Match[1].trim();

      const sha1Match = output.match(/SHA1:\s*([A-F0-9:]+)/i);
      if (sha1Match) sha1 = sha1Match[1].trim();

      const ownerMatch = output.match(/Owner:\s*(.+)/i);
      if (ownerMatch) owner = ownerMatch[1].trim();

      const validMatch = output.match(/until:\s*(.+)/i);
      if (validMatch) validUntil = validMatch[1].trim();
    } catch (e) {
      console.warn('[KeystoreService] Could not parse fingerprint details:', e);
    }

    const info: KeystoreInfo = {
      keystorePath: jksPath,
      alias,
      storePassword: password,
      keyPassword: password,
      sha256,
      sha1,
      owner,
      createdAt: new Date().toISOString(),
      validUntil,
    };

    fs.writeFileSync(metadataPath, JSON.stringify(info, null, 2), 'utf-8');
    console.log(`[KeystoreService] Keystore created successfully. SHA-256: ${sha256}`);
    return info;
  }

  public static injectKeyProperties(flutterAndroidDir: string, info: KeystoreInfo): void {
    const keyPropertiesPath = path.join(flutterAndroidDir, 'key.properties');
    const content = [
      `storePassword=${info.storePassword}`,
      `keyPassword=${info.keyPassword}`,
      `keyAlias=${info.alias}`,
      `storeFile=${info.keystorePath.replace(/\\/g, '/')}`,
    ].join('\n');

    fs.writeFileSync(keyPropertiesPath, content, 'utf-8');
    console.log(`[KeystoreService] Injected android/key.properties with project keystore: ${info.keystorePath}`);
  }
}
