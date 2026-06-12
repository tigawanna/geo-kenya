import { KenyaWardsSelect } from "@/lib/drizzle/schema";
import { CamelToSnakeKeys } from "@/utils/types";

export type WardItem = CamelToSnakeKeys<KenyaWardsSelect>;
export type WardChangesType = {
  changes: {
    data: WardItem;
    event_type: "UPDATE" | "CREATE" | "DELETE";
    timestamp: string;
    ward_id: number;
  };
};
