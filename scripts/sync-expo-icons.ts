import fs from "node:fs";
import path from "node:path";

const DEFAULT_CONFIG = "expo-icons.config.json";

type SyncRule = {
  from: string;
  to: string;
};

type TargetConfig = {
  root?: string;
  files?: Record<string, string>;
};

type ExpoIconsConfig = {
  source?: string;
  expo: Record<string, unknown>;
  mobile?: TargetConfig;
  web?: TargetConfig;
  sync?: {
    mobile?: SyncRule[];
    web?: SyncRule[];
  };
};

type CopyResult = {
  from: string;
  to: string;
};

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

function resolveFromConfig(configDir: string, targetPath: string): string {
  return path.resolve(configDir, targetPath);
}

function getByPath(object: Record<string, unknown>, dottedPath: string): unknown {
  return dottedPath.split(".").reduce<unknown>((current, key) => {
    if (current == null || typeof current !== "object") {
      return undefined;
    }

    return (current as Record<string, unknown>)[key];
  }, object);
}

function ensureDir(filePath: string): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function copyFile(sourcePath: string, destinationPath: string): void {
  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Missing source file: ${sourcePath}`);
  }

  ensureDir(destinationPath);
  fs.copyFileSync(sourcePath, destinationPath);
}

function writeAppJson(sourceDir: string, expoConfig: Record<string, unknown>): void {
  const appJsonPath = path.join(sourceDir, "app.json");
  const payload = { expo: expoConfig };
  fs.writeFileSync(appJsonPath, `${JSON.stringify(payload, null, 2)}\n`);
}

function syncTarget({
  label,
  rootDir,
  fileMap,
  rules,
  config,
  sourceDir,
}: {
  label: string;
  rootDir: string;
  fileMap: Record<string, string>;
  rules: SyncRule[];
  config: ExpoIconsConfig;
  sourceDir: string;
}): CopyResult[] {
  const copies: CopyResult[] = [];

  for (const rule of rules) {
    const relativeSource = getByPath(config, rule.from);
    if (typeof relativeSource !== "string" || relativeSource.length === 0) {
      throw new Error(`Config path "${rule.from}" is missing for ${label}`);
    }

    const relativeDestination = fileMap[rule.to];
    if (typeof relativeDestination !== "string" || relativeDestination.length === 0) {
      throw new Error(`Destination "${rule.to}" is not configured for ${label}`);
    }

    const sourcePath = resolveFromConfig(sourceDir, relativeSource);
    const destinationPath = resolveFromConfig(rootDir, relativeDestination);
    copyFile(sourcePath, destinationPath);
    copies.push({ from: sourcePath, to: destinationPath });
  }

  return copies;
}

function main(): void {
  const configArg = process.argv[2] ?? DEFAULT_CONFIG;
  const configPath = path.resolve(process.cwd(), configArg);
  const configDir = path.dirname(configPath);

  if (!fs.existsSync(configPath)) {
    console.error(`[sync-expo-icons] Config not found: ${configPath}`);
    process.exit(1);
  }

  const config = readJson<ExpoIconsConfig>(configPath);
  const sourceDir = resolveFromConfig(configDir, config.source ?? "./expo-icons");
  const expoConfig = config.expo;

  if (!expoConfig || typeof expoConfig !== "object") {
    console.error("[sync-expo-icons] Config must include an expo object");
    process.exit(1);
  }

  if (!fs.existsSync(sourceDir)) {
    fs.mkdirSync(sourceDir, { recursive: true });
  }

  writeAppJson(sourceDir, expoConfig);

  const mobileRoot = resolveFromConfig(configDir, config.mobile?.root ?? "./apps/mobile");
  const webRoot = resolveFromConfig(configDir, config.web?.root ?? "./apps/web");
  const mobileFiles = config.mobile?.files ?? {};
  const webFiles = config.web?.files ?? {};
  const mobileRules = config.sync?.mobile ?? [];
  const webRules = config.sync?.web ?? [];

  const mobileCopies = syncTarget({
    label: "mobile",
    rootDir: mobileRoot,
    fileMap: mobileFiles,
    rules: mobileRules,
    config,
    sourceDir,
  });

  const webCopies = syncTarget({
    label: "web",
    rootDir: webRoot,
    fileMap: webFiles,
    rules: webRules,
    config,
    sourceDir,
  });

  console.log("[sync-expo-icons] Updated expo-icons/app.json");
  console.log("[sync-expo-icons] Mobile:");
  for (const copy of mobileCopies) {
    console.log(`  ${copy.from} -> ${copy.to}`);
  }
  console.log("[sync-expo-icons] Web:");
  for (const copy of webCopies) {
    console.log(`  ${copy.from} -> ${copy.to}`);
  }
}

main();
