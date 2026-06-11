import { lazy, Suspense } from "react";

const TanstackDevtools = lazy(() =>
  import("@/lib/tanstack/devtools/devtools").then((module) => ({
    default: module.TanstackDevtools,
  })),
);
import {
  TanstackQueryProvider,
  getTanstackQueryContext,
} from "@/lib/tanstack/query/query-provider";
import { ThemeProvider } from "@/lib/tanstack/router/theme-provider";
import { viewerqueryOptions, type TViewer } from "@/data-access-layer/auth/viewer";
import { AppConfig } from "@/utils/system";
import type { QueryClient } from "@tanstack/react-query";
import { HeadContent, Outlet, Scripts, createRootRouteWithContext } from "@tanstack/react-router";
import { createMiddleware } from "@tanstack/react-start";
import { evlogErrorHandler } from "evlog/nitro/v3";
import { Toaster } from "@/components/ui/sonner";
import appCss from "../styles.css?url";

const evlogMiddleware = createMiddleware().server(evlogErrorHandler);

interface RouterContext {
  queryClient: QueryClient;
  viewer?: TViewer;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  server: {
    middleware: [evlogMiddleware],
  },
  beforeLoad: async ({ context }) => {
    const viewer = await context.queryClient.ensureQueryData(viewerqueryOptions);
    return { viewer: viewer.data ?? undefined };
  },
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: AppConfig.name },
      { name: "description", content: AppConfig.description || AppConfig.name },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.png", type: "image/png", sizes: "48x48" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png", sizes: "1024x1024" },
    ],
  }),
  component: RootDocument,
});

function RootDocument() {
  const { queryClient } = getTanstackQueryContext();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <ThemeProvider storageKey={AppConfig.themeStorageKey}>
          <TanstackQueryProvider queryClient={queryClient}>
            <Outlet />
            <Toaster position="bottom-left" />
            {import.meta.env.DEV ? (
              <Suspense fallback={null}>
                <TanstackDevtools />
              </Suspense>
            ) : null}
          </TanstackQueryProvider>
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  );
}
