import { wardsQueryOptions } from "@/data-access-layer/wards-query-options";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, View } from "react-native";
import { Button, Searchbar, Text, useTheme } from "react-native-paper";
import { MaterialIcon } from "../../default/ui/icon-symbol";
import { LoadingFallback } from "../../state-screens/LoadingFallback";
import { NoDataScreen } from "../../state-screens/NoDataScreen";
import { WardListItem } from "./WardListItem";

export function KenyaWards() {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const { data, isPending, refetch, isRefetching } = useQuery(
    wardsQueryOptions({
      searchQuery,
    })
  );

  if (isPending) {
    return <LoadingFallback />;
  }

  if (!data?.result || data.result.length === 0) {
    return (
      <View style={styles.container}>
        {isRefetching ? (
          <ActivityIndicator
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              zIndex: 1000,
              transform: [{ translateX: -20 }, { translateY: -20 }],
            }}
          />
        ) : null}
        <View style={{ height: "80%" }}>
          <KenyaWardsHeader total={0} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          <NoDataScreen
            listName="Wards"
            hint="No wards found"
            icon={<MaterialIcon color={theme.colors.primary} name="location-city" size={64} />}
          />

          <Button
            style={{ marginHorizontal: "20%" }}
            disabled={isRefetching}
            icon="reload"
            mode="contained"
            onPress={() => {
              setSearchQuery("");
              refetch();
            }}>
            Reload
          </Button>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data.result}
        keyExtractor={(item) => item.id.toString()}
        stickyHeaderIndices={[0]}
        renderItem={({ item }) => <WardListItem key={item.id} item={item} theme={theme} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => refetch()}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
        ListHeaderComponent={
          <KenyaWardsHeader
            total={data.result.length}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        }
      />
    </View>
  );
}

interface KenyaWardsHeaderProps {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  total: number;
}
export function KenyaWardsHeader({ searchQuery, setSearchQuery, total }: KenyaWardsHeaderProps) {
  const theme = useTheme();
  return (
    <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.headerContent}>
        <Text
          variant="headlineMedium"
          style={[styles.headerTitle, { color: theme.colors.onSurface }]}>
          Kenya Wards
        </Text>
        <View style={[styles.headerBadge, { backgroundColor: theme.colors.surfaceVariant }]}>
          <MaterialIcon name="format-list-numbered" size={18} color={theme.colors.primary} />
          <Text
            variant="labelLarge"
            style={[styles.headerCount, { color: theme.colors.onSurfaceVariant }]}>
            {total}
          </Text>
        </View>
      </View>
      <View style={styles.searchContainer}>
        <Searchbar
          // ref={ref}
          placeholder="ward,county or constituency..."
          onChangeText={(query) => {
            setSearchQuery(query);
          }}
          value={searchQuery}
          style={styles.searchBar}
          inputStyle={styles.searchInput}
          iconColor={theme.colors.onSurfaceVariant}
          placeholderTextColor={theme.colors.onSurfaceVariant}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.12)",
    elevation: 2,
    width: "100%",
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontWeight: "700",
  },
  headerBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  headerCount: {
    marginLeft: 6,
    fontWeight: "600",
  },
  searchContainer: {
    paddingVertical: 8,
    width: "100%",
  },
  searchBar: {
    elevation: 0,
    shadowOpacity: 0,
  },
  searchInput: {
    fontSize: 16,
  },
  listContent: {
    padding: 16,
  },
});
