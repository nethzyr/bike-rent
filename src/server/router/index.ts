// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { protectedExampleRouter } from "./protected-example-router";
import { bikeRouter } from "./bike";
import { rentalRouter } from "./rental";
import { userRouter } from "./user";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("question.", protectedExampleRouter)
  .merge("bike.", bikeRouter)
  .merge("rental.", rentalRouter)
  .merge("user.", userRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
