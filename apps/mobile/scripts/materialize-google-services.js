const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const DEST = path.join(ROOT, "google-services.json");
const PRODUCTION_PACKAGE = "com.tigawanna.geokenya";

function readGoogleServicesSource() {
  if (fs.existsSync(DEST)) {
    return null;
  }

  const envJson = process.env.GOOGLE_SERVICES_JSON;
  if (envJson) {
    const trimmed = envJson.trim();
    if (trimmed.startsWith("{")) {
      return trimmed;
    }
    if (fs.existsSync(envJson)) {
      return fs.readFileSync(envJson, "utf8");
    }
    throw new Error(
      `GOOGLE_SERVICES_JSON is set but is neither JSON nor a readable file path: ${envJson}`,
    );
  }

  const envFile = process.env.GOOGLE_SERVICES_FILE;
  if (envFile) {
    if (!fs.existsSync(envFile)) {
      throw new Error(`GOOGLE_SERVICES_FILE does not exist: ${envFile}`);
    }
    return fs.readFileSync(envFile, "utf8");
  }

  const secretsFile = path.join(ROOT, ".secrets", "google-services.json");
  if (fs.existsSync(secretsFile)) {
    return fs.readFileSync(secretsFile, "utf8");
  }

  return null;
}

function main() {
  if (fs.existsSync(DEST)) {
    console.log("[materialize-google-services] google-services.json already present");
    return;
  }

  const variant = process.env.APP_VARIANT ?? "production";
  if (variant !== "production") {
    return;
  }

  const source = readGoogleServicesSource();
  if (!source) {
    console.error("[materialize-google-services] google-services.json is required for production builds");
    console.error("");
    console.error("Provide Firebase config using one of:");
    console.error("  apps/mobile/google-services.json");
    console.error("  apps/mobile/.secrets/google-services.json");
    console.error("  GOOGLE_SERVICES_FILE=/absolute/path/to/google-services.json");
    console.error("  GOOGLE_SERVICES_JSON='<json>' or GOOGLE_SERVICES_JSON=/absolute/path/to/file");
    console.error("");
    console.error(`Download it from Firebase Console for package: ${PRODUCTION_PACKAGE}`);
    process.exit(1);
  }

  JSON.parse(source);
  fs.writeFileSync(DEST, source.endsWith("\n") ? source : `${source}\n`);
  console.log("[materialize-google-services] wrote google-services.json");
}

main();
