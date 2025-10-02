import { StyleSheet, View, ScrollView } from "react-native";
import { Text, Surface, useTheme } from "react-native-paper";
import { Collapsible } from "../default/ui/collapsible";

interface DiffViewProps {
  old?: Record<string, any>;
  new?: Record<string, any>;
  truncate?: string[];
}

export function DiffView({ old = {}, new: newObj = {}, truncate = [] }: DiffViewProps) {
  const theme = useTheme();

  const allKeys = new Set([...Object.keys(old), ...Object.keys(newObj)]);

  const getDiffType = (key: string) => {
    if (!(key in old)) return "added";
    if (!(key in newObj)) return "removed";
    if (old[key] !== newObj[key]) return "changed";
    return "unchanged";

  };

  const getColor = (type: string) => {
    switch (type) {
      case "added":
        return theme.colors.primary;
      case "removed":
        return theme.colors.error;
      case "changed":
        return theme.colors.inversePrimary;
      default:
        return theme.colors.onSurface;
    }
  };
  const getBgColor = (type: string) => {
    switch (type) {
      case "added":
        return theme.colors.primaryContainer;
      case "removed":
        return theme.colors.errorContainer;
      case "changed":
        return theme.colors.background;
      default:
        return 
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.surface}>
        {Array.from(allKeys).map((key) => {
          const type = getDiffType(key);
          const color = getColor(type);
          const bgColor = getBgColor(type);

          return (
            <View key={key} style={[styles.row, { backgroundColor: bgColor }]}>
              <Text variant="labelMedium" style={{ color, fontSize: 30 }}>
                {type === "added" ? "+" : type === "removed" ? "-" : type === "changed" ? "~" : " "}
              </Text>
              <View style={styles.content}>
                <Text variant="bodyMedium" style={styles.key}>
                  {key}:
                </Text>
                {type !== "removed" &&
                  (truncate.includes(key) ? (
                    <Collapsible title={key}>
                      <Text variant="bodySmall" style={{ color: theme.colors.onSurface }}>
                        {JSON.stringify(newObj[key])}
                      </Text>
                    </Collapsible>
                  ) : (
                    <Text variant="bodySmall" style={{ color: theme.colors.onSurface }}>
                      {JSON.stringify(newObj[key])}
                    </Text>
                  ))}
                {type === "changed" &&
                  (truncate.includes(key) ? (
                    <Collapsible title="Previous value">
                      <Text variant="bodySmall" style={{ color: theme.colors.outline }}>
                        was: {JSON.stringify(old[key])}
                      </Text>
                    </Collapsible>
                  ) : (
                    <Text variant="bodySmall" style={{ color: theme.colors.outline }}>
                      was: {JSON.stringify(old[key])}
                    </Text>
                  ))}
                {type === "removed" &&
                  (truncate.includes(key) ? (
                    <Collapsible title={key}>
                      <Text variant="bodySmall" style={{ color: theme.colors.outline }}>
                        {JSON.stringify(old[key])}
                      </Text>
                    </Collapsible>
                  ) : (
                    <Text variant="bodySmall" style={{ color: theme.colors.outline }}>
                      {JSON.stringify(old[key])}
                    </Text>
                  ))}
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  surface: {
    margin: 8,
    padding: 8,
  },
  row: {
    flexDirection: "row",
    alignItems:"center",
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginVertical: 2,
  },
  content: {
    flex: 1,
    marginLeft: 8,
  },
  key: {
    fontWeight: "600",
  },
});
