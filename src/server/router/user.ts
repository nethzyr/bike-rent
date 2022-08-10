import { z } from "zod";
import { Role } from "@prisma/client";
import { createProtectedRouter } from "./protected-router";

export const userRouter = createProtectedRouter()
  .query("getAll", {
    input: z.object({ hideInactive: z.boolean() }),
    async resolve({ input, ctx }) {
      const users = await ctx.prisma.user.findMany({
        include: { rentals: true },
      });

      if (input.hideInactive) {
        return users.filter((user) => user.rentals.length);
      }

      return users;
    },
  })
  .query("getUser", {
    input: z.object({ id: z.number() }),
    resolve({ input, ctx }) {
      return ctx.prisma.user.findFirst({ where: { id: input.id } });
    },
  })
  .mutation("update", {
    input: z.object({
      id: z.number(),
      name: z.string(),
      email: z.string(),
      image: z.string(),
      role: z.nativeEnum(Role),
    }),
    resolve({ input, ctx }) {
      return ctx.prisma.user.update({
        where: { id: input.id },
        data: { ...input },
      });
    },
  })
  .mutation("delete", {
    input: z.object({ userId: z.number() }),
    resolve({ input, ctx }) {
      return ctx.prisma.user.delete({ where: { id: input.userId } });
    },
  });
