import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import type { WorkerEnv } from "@/lib/kv";

export const getRouter = (env?: WorkerEnv) => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient, env },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  return router;
};
