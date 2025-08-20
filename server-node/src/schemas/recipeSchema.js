import { z } from "zod";

// Recipe schema with required and optional fields
export const recipeSchema = z.object({
  title: z.string(),
  description: z.string(),
  imageKeywords: z.array(z.string()).optional().default([]),
  ingredients: z.array(
    z.object({
      name: z.string(),
      quantity: z.string().optional(),
      optional: z.boolean().optional().default(false),
    })
  ),
  preparation_time: z.object({
    total: z.number(),
    prep: z.number().optional(),
    cook: z.number().optional(),
  }),
  instructions: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
    })
  ),
  Nutrition: z
    .object({
      calories: z.number().optional(),
      protein: z.number().optional(),
      carbohydrates: z.number().optional(),
      fat: z.number().optional(),
    })
    .optional()
    .default({}),
});
