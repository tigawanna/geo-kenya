import { useSettingsStore, useThemeStore } from "@/store/settings-store";
import { ScrollView, StyleSheet } from "react-native";
import { Divider, List, Surface, Switch } from "react-native-paper";

export default function Settings() {
  const { isDarkMode, toggleTheme } = useThemeStore();
  const { dynamicColors, toggleDynamicColors } = useSettingsStore();

  return (
    <Surface style={{ flex: 1, }}>
      <ScrollView style={[styles.container, { }]}>
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
          <Divider />
        </List.Section>

        {/* <List.Section>
        <List.Subheader style={[styles.listSubHeader]}>API Integration</List.Subheader>
        <List.Item
          title="API Key"
          description="Configure your Wakatime API key"
          left={(props) => <List.Icon {...props} icon="key" />}
          onPress={() => router.push("/api-keys")}
        />
        <Divider />
      </List.Section> */}

        {/* <List.Section>
        <List.Subheader style={[styles.listSubHeader]}>About</List.Subheader>
        <List.Item
          title="Version"
          description="1.0.0"
          left={(props) => <List.Icon {...props} icon="information" />}
        />
        <List.Item
          title="Terms of Service"
          left={(props) => <List.Icon {...props} icon="file-document" />}
          onPress={() => router.push("/terms-of-service")}
        />
        <List.Item
          title="Privacy Policy"
          left={(props) => <List.Icon {...props} icon="shield-account" />}
          onPress={() => router.push("/privacy-policy")}
        />
      </List.Section> */}
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
});
