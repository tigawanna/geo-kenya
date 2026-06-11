import handler, { createServerEntry } from "@tanstack/react-start/server-entry";
import { honoApp } from "@/server/api-routes";

type RequestContext = {
  isServer: true;
};

declare module "@tanstack/react-start" {
  interface Register {
    server: {
      requestContext: RequestContext;
    };
  }
}

type CloudflareServerEntry = {
  fetch: (
    request: Request,
    env: CloudflareBindings,
    ctx: ExecutionContext,
  ) => Promise<Response> | Response;
};

function isHonoApiRoute(pathname: string): boolean {
  return pathname.startsWith("/api") && !pathname.startsWith("/api/auth");
}

const serverEntry: CloudflareServerEntry = {
  async fetch(request, env, ctx) {
    const pathname = new URL(request.url).pathname;
    if (isHonoApiRoute(pathname)) {
      return honoApp.fetch(request, env, ctx);
    }

    return handler.fetch(request, { context: { isServer: true } });
  },
};

export default createServerEntry(serverEntry as unknown as Parameters<typeof createServerEntry>[0]);
