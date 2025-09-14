import { View,StyleSheet } from 'react-native'
import { Card, MD3Theme,Text} from 'react-native-paper';
import { MaterialIcon } from '../default/ui/icon-symbol';

interface WardListItemProps {
  theme: MD3Theme;
  item: {
    id: number;
    ward: string;
    county: string;
    constituency: string;
    wardCode: string | null;
    countyCode: number | null;
    constituencyCode: number | null;
    distance?: number;
  };
}
export function WardListItem({theme,item}:WardListItemProps){
return (
  <Card style={[styles.card, { backgroundColor: theme.colors.surface }]} elevation={1}>
    <Card.Content style={styles.cardContent}>
      <View style={styles.mainContent}>
        <View style={styles.titleContainer}>
          <Text variant="titleLarge" style={[styles.wardName, { color: theme.colors.onSurface }]}>
            {item.ward}
          </Text>
          <MaterialIcon
            name="location-on"
            size={18}
            color={theme.colors.primary}
            style={styles.locationIcon}
          />
        </View>
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <MaterialIcon
              name="map"
              size={16}
              color={theme.colors.onSurfaceVariant}
              style={styles.detailIcon}
            />
            <Text
              variant="bodyMedium"
              style={[styles.detailText, { color: theme.colors.onSurfaceVariant }]}>
              {item.county} County
            </Text>
          </View>
          {item.constituency && (
            <View style={styles.detailRow}>
              <MaterialIcon
                name="account-balance"
                size={16}
                color={theme.colors.onSurfaceVariant}
                style={styles.detailIcon}
              />
              <Text
                variant="bodyMedium"
                style={[styles.detailText, { color: theme.colors.onSurfaceVariant }]}>
                {item.constituency} Constituency
              </Text>
            </View>
          )}
          {item.distance !== undefined && (
            <View style={styles.detailRow}>
              <MaterialIcon
                name="near-me"
                size={16}
                color={theme.colors.primary}
                style={styles.detailIcon}
              />
              <Text
                variant="bodyMedium"
                style={[styles.detailText, { color: theme.colors.primary }]}>
                ~ {(item.distance/1000).toFixed(2)} km away
              </Text>
            </View>
          )}
        </View>
      </View>
      <View style={styles.idContainer}>
        <View style={[styles.idBadge, { backgroundColor: theme.colors.surfaceVariant }]}>
          <Text
            variant="titleMedium"
            style={[styles.idText, { color: theme.colors.onSurfaceVariant }]}>
            {item.id}
          </Text>
        </View>
        <Text
          variant="labelSmall"
          style={[styles.wardCode, { color: theme.colors.onSurfaceDisabled }]}>
          {item.wardCode}
        </Text>
      </View>
    </Card.Content>
  </Card>
);
}
const styles = StyleSheet.create({
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
});
