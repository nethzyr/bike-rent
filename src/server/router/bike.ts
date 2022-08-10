import { z } from "zod";
import { createRouter } from "./context";

export const bikeRouter = createRouter()
  .query("getOne", {
    input: z.object({
      id: z.number(),
    }),
    async resolve({ input, ctx }) {
      return await ctx.prisma.bike.findFirst({
        where: { id: { equals: input.id } },
      });
    },
  })
  .query("getAll", {
    async resolve({ ctx }) {
      const bikes = await ctx.prisma.bike.findMany({
        include: { rentals: { select: { rating: true } } },
      });

      return bikes.map((bike) => ({
        ...bike,
        rating:
          bike.rentals.reduce((acc, curr) => acc + curr.rating, 0) /
          bike.rentals.length,
      }));
    },
  })
  .query("query", {
    input: z
      .object({ start: z.date().nullish(), end: z.date().nullish() })
      .nullish(),
    async resolve({ input, ctx }) {
      let rentedBikes;

      if (input?.start && input?.end) {
        rentedBikes = await ctx.prisma.rental.findMany({
          select: { bikeId: true },
          where: {
            OR: [
              {
                endDate: {
                  lte: input.end,
                  gte: input.start,
                },
              },
              {
                startDate: {
                  lte: input.end,
                },
                endDate: { gt: input.end },
              },
            ],
          },
        });
      }

      const bikes = await ctx.prisma.bike.findMany({
        where: {
          NOT: { id: { in: rentedBikes?.map((bike) => bike.bikeId) } },
          available: true,
        },
        include: { rentals: { select: { rating: true } } },
      });

      return bikes.map((bike) => {
        return {
          ...bike,
          rating:
            bike.rentals.reduce((acc, curr) => acc + curr.rating, 0) /
            bike.rentals.length,
        };
      });
    },
  })
  .mutation("create", {
    input: z.object({
      model: z.string(),
      color: z.string(),
      location: z.string(),
      available: z.boolean(),
    }),
    async resolve({ input, ctx }) {
      return await ctx.prisma.bike.create({ data: input });
    },
  })
  .mutation("edit", {
    input: z.object({
      id: z.number(),
      model: z.string(),
      color: z.string(),
      location: z.string(),
      available: z.boolean(),
    }),
    async resolve({ input, ctx }) {
      return await ctx.prisma.bike.update({
        where: { id: input.id },
        data: input,
      });
    },
  })
  .mutation("delete", {
    input: z.object({ id: z.number() }),
    async resolve({ input, ctx }) {
      return await ctx.prisma.bike.delete({ where: { id: input.id } });
    },
  });
