const fs = require("fs");
const path = require("path");
const { withDangerousMod } = require("@expo/config-plugins");

/**
 * Proper Expo plugin for copying Spatialite native libraries (.so files)
 * during the Android prebuild process using withDangerousMod
 */
module.exports = (config) => {
  return withDangerousMod(config, [
    "android",
    async (config) => {
      // Get the plugin's directory using module.filename
      const pluginDir = module.filename
        ? path.dirname(module.filename)
        : process.cwd();
      const sourceBase = path.join(pluginDir, "spatialite-libs", "jni");
      
      // Get the platform project root (android directory)
      const platformProjectRoot = config.modRequest.platformProjectRoot;
      
      const targetBase = path.join(
        platformProjectRoot,
        "app",
        "src",
        "main",
        "jniLibs"
      );

      if (!fs.existsSync(sourceBase)) {
        console.warn(
          "⚠️  Spatialite libraries not found at:",
          sourceBase
        );
        return config;
      }

      const architectures = ["arm64-v8a", "armeabi-v7a", "x86", "x86_64"];

      for (const arch of architectures) {
        const sourceDir = path.join(sourceBase, arch);
        const targetDir = path.join(targetBase, arch);

        if (fs.existsSync(sourceDir)) {
          // Create target directory
          if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
          }

          // Copy .so files
          const files = fs.readdirSync(sourceDir);
          for (const file of files) {
            if (file.endsWith(".so")) {
              const sourceFile = path.join(sourceDir, file);
              const targetFile = path.join(targetDir, file);
              fs.copyFileSync(sourceFile, targetFile);
              console.log(
                `✓ Copied Spatialite library: ${arch}/${file}`
              );
            }
          }
        }
      }

      console.log("✅ Spatialite native libraries installed successfully!");
      
      return config;
    },
  ]);
};
