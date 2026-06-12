import { getAuth } from "@/lib/auth";
import { definePlugin } from "nitro";
import { identifyUser } from "evlog/better-auth";
import { useLogger } from "evlog/nitro/v3";

const AUTH_PATH_PREFIX = "/api/auth/";

export default definePlugin((nitroApp) => {
  nitroApp.hooks.hook("request", async (event) => {
    const pathname = new URL(event.req.url).pathname;
    if (pathname.startsWith(AUTH_PATH_PREFIX)) {
      return;
    }

    const log = useLogger(event);
    const session = await getAuth().api.getSession({ headers: event.req.headers });
    if (session) {
      identifyUser(log, session);
    }
  });
});
