import * as z from 'zod';

export const CreateCategorySchema = z.object({
  description: z.string().min(3, 'Description is required')
});

export const UpdateCategorySchema = z.object({
  description: z.string().min(3, 'Description is required').optional(),
  active: z.boolean().optional()
});
