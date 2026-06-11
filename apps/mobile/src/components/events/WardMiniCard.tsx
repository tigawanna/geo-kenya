import { KenyaWardsSelect } from "@/lib/drizzle/schema";
import { StyleSheet, View } from "react-native";
import { Text, Surface } from "react-native-paper";
import { Collapsible } from "../default/ui/collapsible";
import { logger } from "@/utils/logger";

interface WardSnakeCase {
  county_code: number | null;
  sub_county: string | null;
  constituency_code: number | null;
  min_x: number | null;
  min_y: number | null;
  max_x: number | null;
  max_y: number | null;
}
interface WardMiniCardProps {
  ward: Partial<KenyaWardsSelect> & Partial<WardSnakeCase>;
}
export function WardMiniCard({ ward }: WardMiniCardProps) {
  if (!ward) return;
  // logger.log("WardMiniCard ward :: ", ward);
  return (
    <View style={styles.container}>
      {ward.ward ? <Text variant="titleMedium">{ward.ward}</Text> : null}
      {ward.id ? <Text variant="bodySmall">ID: {ward.id}</Text> : null}
      {ward.wardCode ? <Text variant="bodySmall">Ward Code: {ward.wardCode}</Text> : null}
      {ward.county ? <Text variant="bodySmall">County: {ward.county}</Text> : null}
      {ward.countyCode || ward.county_code ? (
        <Text variant="bodySmall">County Code: {ward.countyCode || ward.county_code}</Text>
      ) : null}
      {ward.subCounty || ward.sub_county ? (
        <Text variant="bodySmall">Sub County: {ward.subCounty || ward.sub_county}</Text>
      ) : null}
      {ward.constituency ? (
        <Text variant="bodySmall">Constituency: {ward.constituency}</Text>
      ) : null}
      {ward.constituencyCode || ward.constituency_code ? (
        <Text variant="bodySmall">
          Constituency Code: {ward.constituencyCode || ward.constituency_code}
        </Text>
      ) : null}

      {ward.geom ? (
        <Collapsible title="Geometry">
          <Text variant="bodySmall">Geom : {ward.geom}</Text>
        </Collapsible>
      ) : null}

      <View>
        {ward.minX || ward.min_x ? (
          <Text variant="bodySmall">Min X: {ward.minX || ward.min_x}</Text>
        ) : null}
        {ward.minY || ward.min_y ? (
          <Text variant="bodySmall">Min Y: {ward.minY || ward.min_y}</Text>
        ) : null}
        {ward.maxX || ward.max_x ? (
          <Text variant="bodySmall">Max X: {ward.maxX || ward.max_x}</Text>
        ) : null}
        {ward.maxY || ward.max_y ? (
          <Text variant="bodySmall">Max Y: {ward.maxY || ward.max_y}</Text>
        ) : null}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 2,
    margin: 1,
    borderRadius: 8,
  },
});
