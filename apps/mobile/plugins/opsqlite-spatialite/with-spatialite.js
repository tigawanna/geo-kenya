const fs = require("fs");
const path = require("path");
const { withDangerousMod } = require("@expo/config-plugins");

const ARCHITECTURES = ["arm64-v8a", "armeabi-v7a", "x86", "x86_64"];
const FETCH_COMMAND = "pnpm fetch:spatialite";

function missingLibsError(detail) {
  return new Error(
    [
      "SpatiaLite native libraries are not available for prebuild.",
      detail,
      "",
      `These binaries are intentionally not committed. Download them first:`,
      `  ${FETCH_COMMAND}`,
      "",
      "Then run the prebuild again.",
    ].join("\n"),
  );
}

module.exports = (config) => {
  return withDangerousMod(config, [
    "android",
    async (config) => {
      const pluginDir = path.dirname(module.filename);
      const sourceBase = path.join(pluginDir, "spatialite-libs", "jni");
      const platformProjectRoot = config.modRequest.platformProjectRoot;
      const targetBase = path.join(
        platformProjectRoot,
        "app",
        "src",
        "main",
        "jniLibs",
      );

      if (!fs.existsSync(sourceBase)) {
        throw missingLibsError(`Expected libraries at ${sourceBase}.`);
      }

      let copied = 0;

      for (const arch of ARCHITECTURES) {
        const sourceDir = path.join(sourceBase, arch);
        const targetDir = path.join(targetBase, arch);

        const soFile = path.join(sourceDir, "libspatialite.so");
        if (!fs.existsSync(soFile)) {
          throw missingLibsError(`Missing ABI binary: ${soFile}.`);
        }

        fs.mkdirSync(targetDir, { recursive: true });

        for (const file of fs.readdirSync(sourceDir)) {
          if (!file.endsWith(".so")) {
            continue;
          }
          fs.copyFileSync(
            path.join(sourceDir, file),
            path.join(targetDir, file),
          );
          copied += 1;
        }
      }

      console.log(`[with-spatialite] copied ${copied} native libraries`);

      return config;
    },
  ]);
};
