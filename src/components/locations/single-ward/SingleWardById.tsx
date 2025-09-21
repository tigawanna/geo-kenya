import { getWardByIdQueryOptions } from "@/data-access-layer/wards-query-options";
import { useQuery } from "@tanstack/react-query";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, IconButton, useTheme,Text, Surface } from "react-native-paper";
import { getMaterialIconName, MaterialIcon } from "../../default/ui/icon-symbol";
import { LoadingFallback } from "../../state-screens/LoadingFallback";
import { NoDataScreen } from "../../state-screens/NoDataScreen";
import { SingleWardCard } from "./SingleWardCard";
import { useRouter } from "expo-router";
import { ClosestWardsByGeom } from "../proximity/ClosestWardsByGeom";
import { SingleWardMap } from "../maps/SingleWardMap";
import { WardWithNeighborsMap } from "../maps/WardWithNeighborsMap.tsx";
import {
  TabsProvider,
  Tabs,
  TabScreen,
  useTabIndex,
  useTabNavigation,
} from "react-native-paper-tabs";

interface SingleWardByIdProps {
  wardId: string;
}
export function SingleWardById({ wardId }: SingleWardByIdProps) {
  const theme = useTheme();
  const router = useRouter();

  const { data, isPending, refetch, isRefetching } = useQuery(
    getWardByIdQueryOptions({ id: Number(wardId) })
  );

  if (isPending) {
    return (
      <View style={styles.container}>
        <LoadingFallback
          action={
            <View style={styles.buttonContainer}>
              <Button
                disabled={isRefetching}
                loading={isRefetching}
                icon="arrow-left"
                mode="outlined"
                onPress={() => router.back()}>
                Go back
              </Button>
              <Button
                disabled={isRefetching}
                loading={isRefetching}
                icon="reload"
                mode="contained-tonal"
                onPress={() => refetch()}>
                Reload
              </Button>
            </View>
          }
        />
      </View>
    );
  }

  if (!data?.result) {
    return (
      <View style={styles.container}>
        <View style={{ height: "80%", justifyContent: "center", gap: 8 }}>
          <NoDataScreen
            listName="Ward"
            message="Ward not found"
            hint="Please check the ward ID and try again"
            icon={<MaterialIcon color={theme.colors.primary} name="location-city" size={64} />}
          />
          <View style={styles.buttonContainer}>
            <Button
              disabled={isRefetching}
              loading={isRefetching}
              icon="reload"
              mode="contained-tonal"
              onPress={() => refetch()}>
              Reload
            </Button>
            <Button
              disabled={isRefetching}
              loading={isRefetching}
              icon="arrow-left"
              mode="outlined"
              onPress={() => router.back()}>
              Go back
            </Button>
          </View>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <IconButton icon="arrow-left" onPress={() => router.back()} />
      </View>
      <SingleWardCard ward={data.result} />
      <WardWithNeighborsMap wardId={data.result.id} />
      <ClosestWardsByGeom wardId={data.result.id} />
      {/* <TabsProvider
        defaultIndex={0}
        // onChangeIndex={handleChangeIndex} optional
      >
        <Surface style={{ flex: 1, paddingTop: 10 }}>
          <Tabs
            tabHeaderStyle={{
              marginBottom: 12,
            }}
            theme={{
              colors: {
                primary: theme.colors.primary,
                background: theme.colors.surface,
              },
            }}>
            <TabScreen label="Map" icon="compass">
              <WardWithNeighborsMap wardId={data.result.id} />
            </TabScreen>
            <TabScreen label="List" icon={getMaterialIconName("list-box")}>
              <ClosestWardsByGeom wardId={data.result.id} />
            </TabScreen>
          </Tabs>
        </Surface>
      </TabsProvider> */}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    width: "100%",
  },
  header: {
    paddingHorizontal: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    gap: 24,
  },
});
