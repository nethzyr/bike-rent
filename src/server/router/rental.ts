import { z } from "zod";
import { createRouter } from "./context";

export const rentalRouter = createRouter()
  .query("getAll", {
    async resolve({ input, ctx }) {
      return await ctx.prisma.rental.findMany({
        include: { user: true, bike: true },
      });
    },
  })
  .mutation("rate", {
    input: z.object({ id: z.number(), rating: z.number().min(1).max(5) }),
    async resolve({ input, ctx }) {
      return await ctx.prisma.rental.update({
        where: { id: input.id },
        data: { rating: input.rating },
      });
    },
  })
  .mutation("delete", {
    input: z.object({ id: z.number() }),
    async resolve({ input, ctx }) {
      return await ctx.prisma.rental.delete({ where: { id: input.id } });
    },
  })
  .mutation("create", {
    input: z.object({
      startDate: z.date(),
      endDate: z.date(),
      bikeId: z.number(),
      userId: z.number(),
    }),
    async resolve({ input, ctx }) {
      return ctx.prisma.rental.create({ data: input });
    },
  });
