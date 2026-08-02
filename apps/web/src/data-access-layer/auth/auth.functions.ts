import { getAuth } from "@/lib/auth";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";

export const getSession = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const headers = getRequestHeaders();
    return await getAuth().api.getSession({ headers });
  } catch {
    // Public prerender / misconfigured local builds should not crash marketing pages.
    // Auth-gated routes still enforce session via their own middleware.
    return null;
  }
});
