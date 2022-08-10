// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { protectedExampleRouter } from "./protected-example-router";
import { bikeRouter } from "./bike";
import { rentalRouter } from "./rental";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("question.", protectedExampleRouter)
  .merge("bike.", bikeRouter)
  .merge("rental.", rentalRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
