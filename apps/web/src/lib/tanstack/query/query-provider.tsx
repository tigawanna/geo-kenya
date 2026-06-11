import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

let queryClientInstance: QueryClient | null = null;

export function getTanstackQueryContext() {
  if (!queryClientInstance) {
    queryClientInstance = new QueryClient();
  }
  return {
    queryClient: queryClientInstance,
  };
}

export function TanstackQueryProvider({
  children,
  queryClient,
}: {
  children: React.ReactNode;
  queryClient: QueryClient;
}) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
