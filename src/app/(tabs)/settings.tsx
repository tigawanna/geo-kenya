import { customTheme, type CustomThemeKey } from "@/constants/Colors";
import { useSettingsStore, useThemeStore } from "@/store/settings-store";
import { Linking, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Divider, Icon, List, Surface, Switch, useTheme } from "react-native-paper";
import * as Application from "expo-application";

export default function Settings() {
  const theme = useTheme();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const { dynamicColors, toggleDynamicColors, colorScheme, setColorScheme } = useSettingsStore();
  const developerFacingBuildVersion = Application.nativeBuildVersion;

  const colorSchemeOptions = Object.entries(customTheme).map(([key, value]) => ({
    key: key as CustomThemeKey,
    color: value.light.primary,
  }));

  const authorInfo = {
    name: "tigawanna",
    github: "https://github.com/tigawanna",
    website: "https://tigawanna-portfolio.vercel.app",
    email: "denniskinuthiawaweru@gmail.com",
  };

  return (
    <Surface style={{ flex: 1 }}>
      <ScrollView style={[styles.container, {}]}>
        <List.Section>
          <List.Subheader style={[styles.listSubHeader]}>Appearance</List.Subheader>
          <List.Item
            title="Dark Mode"
            left={(props) => <List.Icon {...props} icon="theme-light-dark" />}
            right={() => <Switch value={isDarkMode} onValueChange={toggleTheme} />}
          />
          <List.Item
            title="Dynamic Colors"
            description="Use Material You color palette"
            left={(props) => <List.Icon {...props} icon="palette" />}
            right={() => <Switch value={dynamicColors} onValueChange={toggleDynamicColors} />}
          />
          <List.Item
            title="Color Scheme"
            left={(props) => <List.Icon {...props} icon="palette-swatch" />}
          />
          <View style={styles.colorContainer}>
            {colorSchemeOptions.map((option) => (
              <TouchableOpacity
                key={option.key || "system"}
                onPress={() => setColorScheme(option.key)}
                style={styles.colorDot}>
                <View
                  style={[
                    styles.colorCircle,
                    {
                      backgroundColor: option.color,
                      borderRadius: colorScheme === option.key ? 4 : 18,
                    },
                  ]}>
                  {colorScheme === option.key && (
                    <Icon source="check" size={20} color={theme.colors.onPrimary} />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
          <Divider />
        </List.Section>

        <List.Section>
          <List.Subheader style={[styles.listSubHeader]}>About</List.Subheader>
          <List.Item
            title="Author"
            description={authorInfo.name}
            left={(props) => <List.Icon {...props} icon="account" />}
            onPress={() => Linking.openURL(authorInfo.website)}
          />
          <List.Item
            title="Github"
            description={authorInfo.github}
            left={(props) => <List.Icon {...props} icon="github" />}
            onPress={() => Linking.openURL(authorInfo.github)}
          />
          <List.Item
            title="Version"
            description={developerFacingBuildVersion ?? "??"}
            left={(props) => <List.Icon {...props} icon="information" />}
          />
        </List.Section>
      </ScrollView>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listSubHeader: {
    fontSize: 16,
    fontWeight: "bold",
  },
  colorContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 12,
  },
  colorDot: {
    marginBottom: 4,
  },
  colorCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
});
