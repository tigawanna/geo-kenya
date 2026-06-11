import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { useMaterialDynamicColors } from '../src';

export default function MaterialDynamicColorsExample() {
  const colorScheme = useColorScheme()??"light"
  const { theme, updateTheme, resetTheme } = useMaterialDynamicColors({
    fallbackSourceColor: '#6750A4'
  });

  const currentTheme = theme[colorScheme];

  const sampleColors = [
    { name: 'Red', color: '#F44336' },
    { name: 'Pink', color: '#E91E63' },
    { name: 'Purple', color: '#9C27B0' },
    { name: 'Deep Purple', color: '#673AB7' },
    { name: 'Indigo', color: '#3F51B5' },
    { name: 'Blue', color: '#2196F3' },
    { name: 'Light Blue', color: '#03A9F4' },
    { name: 'Cyan', color: '#00BCD4' },
    { name: 'Teal', color: '#009688' },
    { name: 'Green', color: '#4CAF50' },
    { name: 'Light Green', color: '#8BC34A' },
    { name: 'Lime', color: '#CDDC39' },
    { name: 'Yellow', color: '#FFEB3B' },
    { name: 'Amber', color: '#FFC107' },
    { name: 'Orange', color: '#FF9800' },
    { name: 'Deep Orange', color: '#FF5722' },
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: currentTheme.background,
    },
    scrollView: {
      flex: 1,
      padding: 16,
    },
    header: {
      fontSize: 28,
      fontWeight: 'bold',
      color: currentTheme.onBackground,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: currentTheme.onBackground,
      opacity: 0.7,
      marginBottom: 24,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: currentTheme.onBackground,
      marginBottom: 12,
    },
    colorGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    colorButton: {
      width: '48%',
      height: 48,
      borderRadius: 12,
      marginBottom: 8,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: currentTheme.outline,
    },
    colorButtonText: {
      fontSize: 12,
      fontWeight: '500',
      textAlign: 'center',
    },
    resetButton: {
      backgroundColor: currentTheme.secondaryContainer,
      padding: 16,
      borderRadius: 12,
      alignItems: 'center',
      marginBottom: 24,
    },
    resetButtonText: {
      color: currentTheme.onSecondaryContainer,
      fontSize: 16,
      fontWeight: '600',
    },
    paletteContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    colorSwatch: {
      width: '30%',
      height: 60,
      borderRadius: 8,
      marginBottom: 8,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: currentTheme.outline,
    },
    colorLabel: {
      fontSize: 10,
      fontWeight: '500',
      textAlign: 'center',
      marginTop: 4,
    },
    elevationDemo: {
      marginBottom: 16,
    },
    elevationCard: {
      padding: 16,
      borderRadius: 12,
      marginBottom: 8,
    },
    elevationText: {
      fontSize: 14,
      fontWeight: '500',
    },
  });

  const getContrastColor = (backgroundColor: string) => {
    // Simple contrast calculation - in real app, use a proper contrast library
    const hex = backgroundColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#FFFFFF';
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.header}>Material Dynamic Colors</Text>
        <Text style={styles.subtitle}>
          Explore Material 3 dynamic colors that adapt to your system theme
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choose a Theme Color</Text>
          <View style={styles.colorGrid}>
            {sampleColors.map((item) => (
              <TouchableOpacity
                key={item.name}
                style={[
                  styles.colorButton,
                  { backgroundColor: item.color }
                ]}
                onPress={() => updateTheme(item.color)}
              >
                <Text
                  style={[
                    styles.colorButtonText,
                    { color: getContrastColor(item.color) }
                  ]}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={styles.resetButton} onPress={resetTheme}>
            <Text style={styles.resetButtonText}>Reset to System Theme</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Color Palette</Text>
          <View style={styles.paletteContainer}>
            {[
              { name: 'Primary', color: currentTheme.primary },
              { name: 'Secondary', color: currentTheme.secondary },
              { name: 'Tertiary', color: currentTheme.tertiary },
              { name: 'Surface', color: currentTheme.surface },
              { name: 'Background', color: currentTheme.background },
              { name: 'Error', color: currentTheme.error },
              { name: 'Outline', color: currentTheme.outline },
              { name: 'Primary Container', color: currentTheme.primaryContainer },
              { name: 'Surface Variant', color: currentTheme.surfaceVariant },
            ].map((item) => (
              <View key={item.name} style={{ width: '30%' }}>
                <View
                  style={[
                    styles.colorSwatch,
                    { backgroundColor: item.color }
                  ]}
                />
                <Text style={[styles.colorLabel, { color: currentTheme.onBackground }]}>
                  {item.name}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Elevation Levels</Text>
          <View style={styles.elevationDemo}>
            {[0, 1, 2, 3, 4, 5].map((level) => (
              <View
                key={level}
                style={[
                  styles.elevationCard,
                //   @ts-expect-error
                  { backgroundColor: currentTheme.elevation[`level${level}`] }
                ]}
              >
                <Text
                  style={[
                    styles.elevationText,
                    { color: currentTheme.onSurface }
                  ]}
                >
                  Elevation Level {level}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
