import { Tabs } from "expo-router";
import React from "react";
import { HapticTab } from "@/components/default/haptic-tab";
import { MaterialCommunityIcon, MaterialIcon } from "@/components/default/ui/icon-symbol";
import { HOME_TOUR_ANCHORS } from "@/lib/coachmark/home-tour";
import { useDeviceLocation } from "@/hooks/use-device-location";
import { CoachmarkAnchor } from "@edwardloopez/react-native-coachmark";
import { Platform } from "react-native";
import { useTheme } from "react-native-paper";

export default function TabLayout() {
  const { colors } = useTheme();
  useDeviceLocation();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        headerShown: false,
        tabBarButton: HapticTab,
        headerStyle: {
          backgroundColor: colors.surface,
          borderBottomWidth: 0,
        },
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
          },
          default: {
            backgroundColor: colors.surface,
          },
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcon size={28} name="home-map-marker" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color }) => (
            <CoachmarkAnchor id={HOME_TOUR_ANCHORS.explore} shape="circle" padding={8}>
              <MaterialCommunityIcon size={28} name="view-list" color={color} />
            </CoachmarkAnchor>
          ),
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          href: null,
          title: "Events",
          tabBarIcon: ({ color }) => (
            <MaterialIcon size={28} name="arrow-right-alt" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="updates"
        options={{
          href: null,
          title: "Updates",
          tabBarIcon: ({ color }) => <MaterialIcon size={28} name="network-ping" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          headerShown: true,
          tabBarIcon: ({ color }) => (
            <CoachmarkAnchor id={HOME_TOUR_ANCHORS.settings} shape="circle" padding={8}>
              <MaterialIcon size={28} name="settings" color={color} />
            </CoachmarkAnchor>
          ),
        }}
      />
    </Tabs>
  );
}
