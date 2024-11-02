import * as z from 'zod';

export const CreateCompositionsSchema = z.object({
  final_product: z
    .number()
    .int()
    .positive('Final Product is required')
    .describe('Produto final incluido na composição.'),
  description: z.string().min(3, 'Description is required').optional(),
  created_at: z.date().optional().describe('Date of Creation'),
  updated_at: z.date().optional(),
  created_by: z.string().min(3, 'Created by is required').optional(),
  updated_by: z.string().min(3, 'Updated by is required').optional(),
  production_steps: z.object({}),
  composition_items: z.array(
    z.object({
      composition_id: z
        .number()
        .int()
        .positive('Composition is required')
        .optional(),
      sequence: z.number().int().positive('Sequence is required').optional(),
      raw_product: z.number().int().positive('Product is required'),
      quantity: z.number().int().positive('Quantity is required'),
      created_at: z.date().optional(),
      updated_at: z.date().optional(),
      created_by: z.string().min(3, 'Created by is required').optional(),
      updated_by: z.string().min(3, 'Updated by is required').optional()
    })
  )
});

export const UpdateCompositionsSchema = z.object({
  description: z.string().min(3, 'Description is required'),
  updated_at: z.date().optional(),
  updated_by: z.string().min(3, 'Updated by is required').optional(),
  production_steps: z.object({}),
  composition_items: z.array(
    z.object({
      id: z.number().int().positive('Quantity is required').optional(),
      quantity: z.number().int().positive('Quantity is required'),
      updated_at: z.date().optional(),
      updated_by: z.string().min(3, 'Updated by is required').optional()
    })
  )
});
