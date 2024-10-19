import * as z from 'zod';

export const CreateProductionSchema = z.object({
  number: z.number().int().positive('Number is required'),
  description: z.string().min(3, 'Description is required'),
  production_date: z.string().min(3, 'Production date is required'),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  created_by: z.number().int().positive('Created by is required').default(1),
  updated_by: z.number().int().positive('Updated by is required').default(1),
  Production_Status: z.string().optional(),
  production_items: z
    .array(
      z.object({
        production_order_id: z
          .number()
          .int()
          .positive('Production order is required'),
        sequence: z.number().int().positive('Sequence is required'),
        final_product_id: z
          .number()
          .int()
          .positive('Final product is required'),
        prodution_quantity_estimated: z
          .number()
          .int()
          .positive('Estimated quantity is required'),
        production_quantity_real: z
          .number()
          .int()
          .positive('Real quantity is required'),
        production_quantity_loss: z
          .number()
          .int()
          .positive('Loss quantity is required'),
        lote: z.string().min(3, 'Lote is required'),
        lote_expiration: z.string().min(3, 'Lote expiration is required'),
        created_at: z.string().optional(),
        updated_at: z.string().optional(),
        created_by: z.number().int().positive('Created by is required'),
        updated_by: z.number().int().positive('Updated by is required')
      })
    )
    .optional()
});

export const UpdateProductionSchema = z.object({
  description: z.string().min(3, 'Description is required').optional(),
  production_date: z.string().min(3, 'Production date is required').optional(),
  updated_at: z.string().optional(),
  updated_by: z.number().int().positive('Updated by is required').optional(),
  Production_Status: z.string().optional(),
  production_items: z
    .array(
      z.object({
        prodution_quantity_estimated: z
          .number()
          .int()
          .positive('Estimated quantity is required')
          .optional(),
        production_quantity_real: z
          .number()
          .int()
          .positive('Real quantity is required')
          .optional(),
        production_quantity_loss: z
          .number()
          .int()
          .positive('Loss quantity is required')
          .optional(),
        updated_at: z.string().optional(),
        updated_by: z
          .number()
          .int()
          .positive('Updated by is required')
          .optional()
      })
    )
    .optional()
});
