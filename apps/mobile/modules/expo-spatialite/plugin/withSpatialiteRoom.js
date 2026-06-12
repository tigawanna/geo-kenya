const { withProjectBuildGradle } = require('@expo/config-plugins');

const withSpatialiteRoom = (config) => {
  // Add JitPack repository to project build.gradle
  config = withProjectBuildGradle(config, (config) => {
    const jitpackRepository = "maven { url 'https://www.jitpack.io' }";
    
    // Check if JitPack repository is already present
    if (!config.modResults.contents.includes(jitpackRepository)) {
      // Try to add to existing allprojects.repositories block
      const allProjectsRepositoriesRegex = /(allprojects\s*{[\s\S]*?repositories\s*{)/;
      
      if (allProjectsRepositoriesRegex.test(config.modResults.contents)) {
        // Add JitPack repository to existing allprojects block
        config.modResults.contents = config.modResults.contents.replace(
          allProjectsRepositoriesRegex,
          `$1\n        ${jitpackRepository}`
        );
      } else {
        // If no allprojects block exists, add it before the closing brace
        config.modResults.contents = config.modResults.contents.replace(
          /}(\s*)$/,
          `allprojects {\n    repositories {\n        ${jitpackRepository}\n    }\n}\n}$1`
        );
      }
    }

    return config;
  });

  return config;
};

module.exports = withSpatialiteRoom;