import { PropsWithChildren, useState } from "react";
import { httpLink } from "@trpc/client";
import { loggerLink } from "@trpc/client/links/loggerLink";
import { trpc } from "./../../trpc/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAppBridge } from "@shopify/app-bridge-react";
import { useAuthenticatedFetch } from "@/hooks/useAuthenticatedFetch";
import superjson from "superjson";

/**
 * Sets up the QueryClientProvider from react-query.
 * @desc See: https://react-query.tanstack.com/reference/QueryClientProvider#_top
 */
export function QueryProvider({ children }: PropsWithChildren<{}>) {
  console.log("in query provider");
  const appBridge = useAppBridge();
  console.log("appBridge.localOrigin", appBridge.localOrigin);
  console.log("appBridge.hostOrigin", appBridge.hostOrigin);

  const [queryClient] = useState(() => new QueryClient());

  const fetchFunction = useAuthenticatedFetch();

  const [trpcClient] = useState(() =>
    trpc.createClient({
      transformer: superjson,
      links: [
        httpLink({
          // @ts-ignore
          fetch: fetchFunction,
          url: `/api/trpc`,
        }),
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === "development" ||
            (opts.direction === "down" && opts.result instanceof Error),
        }),
      ],
    }),
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}
