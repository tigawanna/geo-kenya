import { getAuth } from "@/lib/auth";
import { createEvlogFsDrain } from "@/server/evlog-drain";
import { syncRoutes } from "@/server/sync-routes";
import { parseError } from "evlog";
import { createAuthMiddleware } from "evlog/better-auth";
import { evlog, type EvlogVariables } from "evlog/hono";
import { Hono } from "hono";
import { cors } from "hono/cors";
import type { ContentfulStatusCode } from "hono/utils/http-status";

type ApiBindings = { Bindings: CloudflareBindings } & EvlogVariables;

export const apiRoutes = new Hono<ApiBindings>()
  .use(
    "*",
    evlog({
      drain: createEvlogFsDrain(),
      exclude: ["/health", "/_evlog/**"],
    }),
  )
  .use("*", async (c, next) => {
    const identify = createAuthMiddleware(getAuth(), { exclude: ["/_evlog/**"] });
    await identify(c.get("log"), c.req.raw.headers, c.req.path);
    await next();
  })
  .use(
    "*",
    cors({
      origin: (origin, c) => {
        const raw = String(c.env.CORS_ORIGINS ?? c.env.BETTER_AUTH_URL ?? "http://localhost:3050");
        const allowed = raw
          .split(",")
          .map((value) => value.trim())
          .filter(Boolean);
        if (!origin) return allowed[0];
        return allowed.includes(origin) ? origin : allowed[0];
      },
      credentials: true,
      allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      allowHeaders: ["Content-Type", "Authorization", "x-sync-secret"],
      maxAge: 86400,
    }),
  )
  .get("/health", (c) =>
    c.json({
      ok: true,
      service: "geo-kenya",
    }),
  )
  .get("/_evlog/logs", async (c) => {
    if (!import.meta.env.DEV) {
      return c.notFound();
    }

    const { readMemoryLogs, parseReadMemoryLogsQuery } = await import("evlog/memory");
    return c.json(readMemoryLogs(parseReadMemoryLogsQuery(c.req.query())));
  })
  .route("/sync", syncRoutes)
  .onError((error, c) => {
    c.get("log").error(error);
    const parsed = parseError(error);

    return c.json(
      {
        message: parsed.message,
        why: parsed.why,
        fix: parsed.fix,
        link: parsed.link,
      },
      parsed.status as ContentfulStatusCode,
    );
  });

export const honoApp = new Hono<ApiBindings>().route("/api", apiRoutes);

export type HonoAppType = typeof honoApp;
