import * as z from 'zod';

export const CreateCategorySchema = z.object({
  description: z.string().min(3, 'Description is required'),
  active: z.boolean().default(true)
});

export const UpdateCategorySchema = z.object({
  description: z.string().min(3, 'Description is required'),
  active: z.boolean().default(true)
});
