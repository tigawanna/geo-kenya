import { db } from "@/lib/drizzle/client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, View } from "react-native";
import { Button, Card, Searchbar, Text, useTheme } from "react-native-paper";
import { MaterialIcon } from "../default/ui/icon-symbol";
import { LoadingFallback } from "../state-screens/LoadingFallback";
import { NoDataScreen } from "../state-screens/NoDataScreen";
import { WardListItem } from "./WardListItem";

export function KenyaWards() {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  // const searchQuery = useDebounce(topSearchQuery, 500);
  const { data, isPending, refetch, isRefetching } = useQuery({
    queryKey: ["wards", searchQuery],
    placeholderData: (previousData) => previousData,
    queryFn: async () => {
      try {
        const result = await db.query.kenyaWards.findMany({
          columns: {
            geom: false,
            subCounty: false,
          },
          where(fields, operators) {
            if (searchQuery && searchQuery.length > 0) {
              const lowercaseSearch = searchQuery.toLowerCase();
              return operators.or(
                operators.like(operators.sql`lower(ward)`, `%${lowercaseSearch}%`),
                operators.like(operators.sql`lower(${fields.county})`, `%${lowercaseSearch}%`),
                operators.like(operators.sql`lower(${fields.constituency})`, `%${lowercaseSearch}%`)
              );
            }
            // Return undefined or omit where clause if no searchQuery
            return undefined;
          },
        });
        return {
          result,
          error: null,
        };
      } catch (e) {
        // console.error(e);
        return {
          result: null,
          error: e instanceof Error ? e.message : JSON.stringify(e),
        };
      }
    },
  });

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
        renderItem={({ item }) => <WardListItem key={item.id} item={item} theme={theme}  />}
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
  searchResults: {
    marginTop: 4,
    marginLeft: 12,
    opacity: 0.7,
  },
  listContent: {
    padding: 16,
  },
  card: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: "hidden",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  mainContent: {
    flex: 1,
    paddingRight: 12,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  wardName: {
    fontWeight: "600",
    marginRight: 8,
  },
  locationIcon: {
    marginTop: 2,
  },
  detailsContainer: {
    marginLeft: 4,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  detailIcon: {
    marginRight: 8,
  },
  detailText: {
    // Color applied dynamically
  },
  idContainer: {
    alignItems: "center",
  },
  idBadge: {
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  idText: {
    fontWeight: "700",
  },
  wardCode: {
    fontSize: 12,
    // Color applied dynamically
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  errorText: {
    marginTop: 16,
    textAlign: "center",
    // Color applied dynamically
  },
});
