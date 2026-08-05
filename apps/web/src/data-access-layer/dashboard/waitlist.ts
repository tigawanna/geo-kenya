import { createDb } from "@/db/d1";
import { waitlist } from "@/lib/drizzle/schema";
import { serializeError } from "@/utils/error";
import { createServerFn } from "@tanstack/react-start";
import { env } from "cloudflare:workers";
import { eq } from "drizzle-orm";
import { viewerMiddleware } from "../auth/viewer";
import { queryOptions } from "@tanstack/react-query";

export const viewerWaitList = createServerFn({ method: "GET" })
  .middleware([viewerMiddleware])
  .handler(async ({ context }) => {
    try {
      const db = createDb(env.DB);
      const viewer = context.viewer;
      const waitList = await db.query.waitlist.findFirst({
        where: eq(waitlist.email, viewer.user?.email),
      });
      return {
        data: waitList,
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error: serializeError(error),
      };
    }
  });

export const waitListQueryOptions = queryOptions({
  queryKey: ["waitlist"],
  queryFn: () => viewerWaitList(),
});
