import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";

interface QueryClientWrapperPrips {
  children: React.ReactNode;
  qcFn: (qc: QueryClient) => void;
}
export function QueryClientWrapper({ children, qcFn }: QueryClientWrapperPrips) {
  const qc = useQueryClient();
  useEffect(() => {
    qcFn(qc);
  }, [qcFn]);
  return <View style={{ ...styles.container }}>{children}</View>;
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
