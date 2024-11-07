import * as z from 'zod';

export const CreateProductSchema = z.object({
  description: z.string().min(3, 'Description is required'),
  code: z.string().min(3, 'Code is required'),
  sku: z.string().min(3, 'SKU is required'),
  origin: z.string().default('RAW_MATERIAL'),
  unit_measure: z.string().default('KG').optional(),
  category_id: z.number().int().positive('Category is required').default(1),
  group_id: z.number().int().positive('Group is required').default(1),
  supplier_id: z.number().int().positive('Supplier is required').optional(),
  nutritional_info: z.string().optional()
});

export const UpdateProductSchema = z.object({
  description: z.string().min(3, 'Description is required').optional(),
  origin: z.string().default('RAW_MATERIAL').optional(),
  category_id: z.number().int().positive('Category is required').optional(),
  group_id: z.number().int().positive('Group is required').optional(),
  supplier_id: z.number().int().positive('Supplier is required').optional(),
  nutritional_info: z.string().optional()
});
