import * as z from 'zod';

export const CreateStockLocationSchema = z.object({
  description: z.string().min(3, 'Description is required'),
  active: z.boolean().optional().default(true)
});

export const UpdateStockLocationSchema = z.object({
  description: z.string().min(3, 'Description is required').optional(),
  active: z.boolean().optional()
});
