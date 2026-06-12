const fs = require("fs");
const os = require("os");
const path = require("path");
const https = require("https");
const http = require("http");
const { execSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const CONFIG_PATH = path.join(ROOT, "spatialite.release.json");
const PLUGIN_DIR = path.join(ROOT, "plugins", "opsqlite-spatialite");
const JNI_DIR = path.join(PLUGIN_DIR, "spatialite-libs", "jni");
const VERSION_MARKER = path.join(PLUGIN_DIR, "spatialite-libs", ".release-version");
const PROJECT_CACHE_DIR = path.join(ROOT, ".cache", "spatialite-downloads");
const ARCHITECTURES = ["arm64-v8a", "armeabi-v7a", "x86", "x86_64"];

function readConfig() {
  const raw = fs.readFileSync(CONFIG_PATH, "utf8");
  return JSON.parse(raw);
}

function resolveReleaseVersion(config) {
  const cliVersion = process.argv[2];
  if (cliVersion) {
    return cliVersion.replace(/^v/, "");
  }

  if (process.env.SPATIALITE_RELEASE_VERSION) {
    return process.env.SPATIALITE_RELEASE_VERSION.replace(/^v/, "");
  }

  return String(config.releaseVersion).replace(/^v/, "");
}

function getGlobalCacheDir() {
  return (
    process.env.SPATIALITE_CACHE_DIR ??
    path.join(os.homedir(), ".cache", "react-native-spatialite-artifacts")
  );
}

function followRedirects(url, maxRedirects = 5) {
  return new Promise((resolve, reject) => {
    if (maxRedirects <= 0) {
      reject(new Error("Too many redirects"));
      return;
    }

    const client = url.startsWith("https") ? https : http;
    client
      .get(url, { headers: { "User-Agent": "geo-kenya-fetch-spatialite" } }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          followRedirects(res.headers.location, maxRedirects - 1).then(resolve, reject);
          return;
        }
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode} for ${url}`));
          return;
        }
        resolve(res);
      })
      .on("error", reject);
  });
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    followRedirects(url)
      .then((stream) => {
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        const file = fs.createWriteStream(dest);
        stream.pipe(file);
        file.on("finish", () => {
          file.close();
          resolve();
        });
        file.on("error", (err) => {
          fs.unlink(dest, () => reject(err));
        });
      })
      .catch(reject);
  });
}

function libsAreComplete() {
  return ARCHITECTURES.every((arch) =>
    fs.existsSync(path.join(JNI_DIR, arch, "libspatialite.so")),
  );
}

function readInstalledVersion() {
  if (!fs.existsSync(VERSION_MARKER)) {
    return null;
  }
  return fs.readFileSync(VERSION_MARKER, "utf8").trim();
}

function writeInstalledVersion(releaseVersion) {
  fs.mkdirSync(path.dirname(VERSION_MARKER), { recursive: true });
  fs.writeFileSync(VERSION_MARKER, `${releaseVersion}\n`);
}

function copyFile(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

async function ensureZip(zipPath, downloadUrl) {
  const globalZipPath = path.join(getGlobalCacheDir(), path.basename(zipPath));

  for (const candidate of [zipPath, globalZipPath]) {
    if (fs.existsSync(candidate) && isValidZip(candidate)) {
      const label = candidate === zipPath ? "project cache" : "global cache";
      console.log(`[fetch-spatialite] using ${label} ${candidate}`);
      if (candidate !== zipPath) {
        copyFile(candidate, zipPath);
      }
      return;
    }
    if (fs.existsSync(candidate)) {
      console.log(`[fetch-spatialite] removing invalid cache ${candidate}`);
      removeIfExists(candidate);
    }
  }

  console.log(`[fetch-spatialite] ${downloadUrl}`);
  await downloadFile(downloadUrl, zipPath);

  if (!isValidZip(zipPath)) {
    removeIfExists(zipPath);
    throw new Error(`Downloaded file is not a valid zip: ${zipPath}`);
  }

  copyFile(zipPath, globalZipPath);
}

function isValidZip(zipPath) {
  try {
    execSync(`unzip -tq "${zipPath}"`, { stdio: "pipe" });
    return true;
  } catch {
    return false;
  }
}

function removeIfExists(filePath) {
  if (fs.existsSync(filePath)) {
    fs.rmSync(filePath, { force: true });
  }
}

function extractZip(zipPath) {
  fs.mkdirSync(JNI_DIR, { recursive: true });

  for (const arch of ARCHITECTURES) {
    const archDir = path.join(JNI_DIR, arch);
    if (fs.existsSync(archDir)) {
      fs.rmSync(archDir, { recursive: true, force: true });
    }
  }

  execSync(`unzip -o "${zipPath}" -d "${JNI_DIR}"`, { stdio: "inherit" });

  if (!libsAreComplete()) {
    throw new Error(
      `Extracted zip is missing expected ABI folders under ${JNI_DIR}. Check the release asset layout.`,
    );
  }
}

async function fetchAndroidLibs(repo, releaseVersion) {
  const zipName = `spatialite-android-${releaseVersion}.zip`;
  const downloadUrl = `https://github.com/${repo}/releases/download/v${releaseVersion}/${zipName}`;
  const zipPath = path.join(PROJECT_CACHE_DIR, zipName);

  console.log(`[fetch-spatialite] release v${releaseVersion}`);

  await ensureZip(zipPath, downloadUrl);
  extractZip(zipPath);
  writeInstalledVersion(releaseVersion);
  console.log(`[fetch-spatialite] installed to ${JNI_DIR}`);
}

async function main() {
  const config = readConfig();
  const repo = process.env.SPATIALITE_REPO ?? config.repo;
  const releaseVersion = resolveReleaseVersion(config);
  const installedVersion = readInstalledVersion();

  if (libsAreComplete()) {
    if (!installedVersion || installedVersion === releaseVersion) {
      if (!installedVersion) {
        writeInstalledVersion(releaseVersion);
      }
      console.log(
        `[fetch-spatialite] v${releaseVersion} already present at ${JNI_DIR}, skipping`,
      );
      return;
    }

    console.log(
      `[fetch-spatialite] upgrading from v${installedVersion} to v${releaseVersion}`,
    );
  }

  try {
    await fetchAndroidLibs(repo, releaseVersion);
  } catch (err) {
    console.error(`[fetch-spatialite] failed: ${err.message}`);
    console.error("");
    console.error("Update spatialite.release.json or pass a version:");
    console.error("  pnpm fetch:spatialite -- 0.0.2");
    console.error("");
    console.error(`Releases: https://github.com/${repo}/releases`);
    process.exit(1);
  }
}

main();
