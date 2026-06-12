const { withGradleProperties } = require("expo/config-plugins");

const JVM_ARGS = "-Xmx4g -XX:MaxMetaspaceSize=1g";

module.exports = function withGradleMemory(config) {
  return withGradleProperties(config, (config) => {
    const props = config.modResults;
    const index = props.findIndex(
      (item) => item.type === "property" && item.key === "org.gradle.jvmargs",
    );

    if (index >= 0) {
      props[index].value = JVM_ARGS;
    } else {
      props.push({
        type: "property",
        key: "org.gradle.jvmargs",
        value: JVM_ARGS,
      });
    }

    return config;
  });
};
