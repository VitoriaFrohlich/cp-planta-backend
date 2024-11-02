import * as z from 'zod';

export const CreateProductionProgressSchema = z.object({
  description: z.string().min(3, 'Description is required'),
  active: z.boolean().default(true)
});

export const UpdateProductionProgressSchema = z.object({
  description: z.string().min(3, 'Description is required'),
  active: z.boolean().default(true)
});
