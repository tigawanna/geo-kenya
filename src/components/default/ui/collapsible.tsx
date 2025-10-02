import { PropsWithChildren, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { IconSymbol } from "@/components/default/ui/icon-symbol";
import { Text, useTheme } from "react-native-paper";

export function Collapsible({ children, title }: PropsWithChildren & { title: string }) {
  const [isOpen, setIsOpen] = useState(false);
  // const theme = useColorScheme() ?? 'light';
  const theme = useTheme();

  return (
    <View>
      <TouchableOpacity
        style={styles.heading}
        onPress={() => setIsOpen((value) => !value)}
        activeOpacity={0.8}>
        <Text>{title}</Text>
        <IconSymbol
          name="chevron.right"
          size={18}
          weight="medium"
          color={theme.colors.primary}
          style={{ transform: [{ rotate: isOpen ? "90deg" : "0deg" }] }}
        />
      </TouchableOpacity>
      {isOpen && (
        <View style={{ ...styles.content, backgroundColor: theme.colors.surface }}>{children}</View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 6,
    padding: 4,
  },
  content: {
    marginTop: 6,
    marginLeft: 4,
    padding: 4,
    paddingHorizontal:12,
    borderRadius: 8,
  },
});
