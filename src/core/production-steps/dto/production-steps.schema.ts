import * as z from 'zod';

export const CreateProductionStepSchema = z.object({
  description: z.string().min(3, 'Description is required'),
  active: z.boolean().default(true)
});

export const UpdateProductionStepSchema = z.object({
  description: z.string().min(3, 'Description is required'),
  active: z.boolean().default(true)
});
