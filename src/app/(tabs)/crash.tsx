import { testCrash } from "@/lib/firebase/crashalytics/crashlytics";
import { StyleSheet } from "react-native";
import { Text, Surface, Button } from "react-native-paper";

export default function crash() {
  return (
    <Surface style={styles.container}>
      <Text variant="titleLarge" style={styles.title}>
        Test Crashlytics
      </Text>
      <Text variant="bodyMedium" style={styles.description}>
        Press the button below to deliberately crash the app and test Firebase Crashlytics
        reporting.
      </Text>
      <Button mode="contained" onPress={()=>testCrash()} icon="alert" style={styles.button}>
        Crash App
      </Button>
    </Surface>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    marginBottom: 16,
  },
  description: {
    textAlign: "center",
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  button: {
    marginTop: 8,
  },
});
