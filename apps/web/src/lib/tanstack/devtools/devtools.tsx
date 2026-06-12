import { TanStackDevtools } from "@tanstack/react-devtools";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";

export function TanstackDevtools() {
  return (
    <>
      <TanStackDevtools
        config={{
          position: "bottom-right",
          hideUntilHover: true,
        }}
        eventBusConfig={{
          connectToServerBus: true,
        }}
        plugins={[
          {
            name: "TanStack Query",
            render: <ReactQueryDevtoolsPanel />,
            defaultOpen: true,
          },
        ]}
      />
    </>
  );
}
