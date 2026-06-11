import { createRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { getTanstackQueryContext } from "./lib/tanstack/query/query-provider";
import { RouterNotFoundComponent } from "./lib/tanstack/router/RouterNotFoundComponent";
import { RouterPendingComponent } from "./lib/tanstack/router/RouterPendingComponent";
import { RouterErrorComponent } from "./lib/tanstack/router/routerErrorComponent";
import { routeTree } from "./routeTree.gen";

export const getRouter = async () => {
  const tanstackQueryContext = getTanstackQueryContext();
  const router = createRouter({
    routeTree,
    defaultPendingComponent: () => <RouterPendingComponent />,
    defaultNotFoundComponent: () => <RouterNotFoundComponent />,
    defaultErrorComponent: ({ error }) => <RouterErrorComponent error={error} />,
    context: {
      ...tanstackQueryContext,
    },
    defaultPreload: "intent",
  });

  setupRouterSsrQueryIntegration({ router, queryClient: tanstackQueryContext.queryClient });
  return router;
};
