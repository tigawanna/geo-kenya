import { KenyaWardsSelect } from "@/lib/drizzle/schema";
import { CamelToSnakeKeys } from "@/utils/types";

export type WardItem = CamelToSnakeKeys<KenyaWardsSelect>;
