import { z } from "zod";
import { createRouter } from "./context";

export const ratingRouter = createRouter().mutation("upsert", {
  input: z.object({
    rental: z.object({
      id: z.number(),
      bikeId: z.number(),
      rating: z.object({
        value: z.number().min(1).max(5),
      }),
    }),
  }),
  async resolve({ input, ctx }) {
    console.log(input);
    return await ctx.prisma.rental.update({
      where: { id: input.rental.id },
      data: {
        rating: {
          upsert: {
            update: {
              value: input.rental.rating.value,
            },
            create: {
              bikeId: input.rental.bikeId,
              value: input.rental.rating.value,
            },
          },
        },
      },
    });
  },
});
