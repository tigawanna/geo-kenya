import { useIsFetching, useIsMutating, type Query } from "@tanstack/react-query";
import Nprogress from "./Nprogress";

function isBackgroundFetch(query: Query) {
  return query.state.fetchStatus === "fetching" && query.state.data !== undefined;
}

export function QueryActivityNprogress() {
  const isMutating = useIsMutating() > 0;
  const isRefetching = useIsFetching({ predicate: isBackgroundFetch }) > 0;

  return <Nprogress isAnimating={isMutating || isRefetching} />;
}
