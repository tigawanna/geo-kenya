import type { TooltipRenderProps } from "@edwardloopez/react-native-coachmark";
import { memo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "react-native-paper";

function StepDots({
  count,
  index,
  activeColor,
  idleColor,
}: {
  count: number;
  index: number;
  activeColor: string;
  idleColor: string;
}) {
  return (
    <View style={styles.dots} accessibilityElementsHidden>
      {Array.from({ length: count }, (_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            {
              backgroundColor: i === index ? activeColor : idleColor,
              opacity: i === index ? 1 : 0.4,
              transform: [{ scale: i === index ? 1.2 : 1 }],
            },
          ]}
        />
      ))}
    </View>
  );
}

function ActionButton({
  label,
  onPress,
  backgroundColor,
  textColor,
  primary,
}: {
  label: string;
  onPress: () => void;
  backgroundColor: string;
  textColor: string;
  primary?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.btn,
        primary && styles.btnPrimary,
        { backgroundColor, opacity: pressed ? 0.88 : 1 },
      ]}>
      <Text style={[styles.btnText, { color: textColor }]}>{label}</Text>
    </Pressable>
  );
}

/**
 * Compact coachmark tooltip with even spacing:
 * title → description → centered dots → actions (secondary left, primary right).
 */
export const HomeTourTooltip = memo(function HomeTourTooltip({
  title,
  description,
  index,
  count,
  isFirst,
  isLast,
  onNext,
  onBack,
  onSkip,
}: TooltipRenderProps) {
  const paper = useTheme();
  const surface = paper.colors.elevation.level3;
  const onSurface = paper.colors.onSurface;
  const onSurfaceMuted = paper.colors.onSurfaceVariant;
  const primary = paper.colors.primary;
  const onPrimary = paper.colors.onPrimary;
  const secondary = paper.colors.surfaceVariant;
  const onSecondary = paper.colors.onSurfaceVariant;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: surface,
          borderColor: paper.colors.outlineVariant,
        },
      ]}
      accessible
      accessibilityRole="alert"
      accessibilityLabel={`${title ?? ""}. ${description ?? ""}. Step ${index + 1} of ${count}.`}>
      {title ? (
        <Text style={[styles.title, { color: onSurface }]} numberOfLines={2}>
          {title}
        </Text>
      ) : null}

      {description ? (
        <Text style={[styles.description, { color: onSurfaceMuted }]}>{description}</Text>
      ) : null}

      <StepDots count={count} index={index} activeColor={primary} idleColor={secondary} />

      <View style={styles.actions}>
        <View style={styles.actionsLeft}>
          {!isFirst ? (
            <ActionButton
              label="Back"
              onPress={onBack}
              backgroundColor={secondary}
              textColor={onSecondary}
            />
          ) : null}
          {!isLast ? (
            <ActionButton
              label="Skip"
              onPress={onSkip}
              backgroundColor={secondary}
              textColor={onSecondary}
            />
          ) : null}
        </View>

        <ActionButton
          label={isLast ? "Done" : "Next"}
          onPress={onNext}
          backgroundColor={primary}
          textColor={onPrimary}
          primary
        />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    width: 300,
    maxWidth: "92%",
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
    gap: 10,
    shadowColor: "#000",
    shadowOpacity: 0.22,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 22,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  dots: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 2,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  actionsLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexShrink: 1,
  },
  btn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    minWidth: 56,
    alignItems: "center",
  },
  btnPrimary: {
    minWidth: 68,
    paddingHorizontal: 16,
  },
  btnText: {
    fontSize: 13,
    fontWeight: "600",
  },
});
