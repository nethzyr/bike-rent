import { z } from "zod";
import { createRouter } from "./context";

export const rentalRouter = createRouter()
  .query("getAll", {
    async resolve({ input, ctx }) {
      return await ctx.prisma.rental.findMany({
        include: { user: true, bike: true, rating: true },
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
