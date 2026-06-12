import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";

interface QueryClientWrapperPrips {
  children: React.ReactNode;
  qcFn: (qc: QueryClient) => void;
}
export function QueryClientWrapper({ children, qcFn }: QueryClientWrapperPrips) {
  const testQueryClient = useMemo(() => {
    const qc = new QueryClient({
      defaultOptions: {
        queries: {
          enabled: false,
          retry: false,
          staleTime: Infinity,
        },
      },
    });
    qcFn(qc);
    return qc;
  }, [qcFn]);

  return (
    <QueryClientProvider client={testQueryClient}>
      <View style={styles.container}>{children}</View>
    </QueryClientProvider>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
