import { Production_Status } from 'src/core/common/enums';
import * as z from 'zod';

export const CreateProductionSchema = z.object({
  production_date: z
    .string()
    .transform(str => new Date(str))
    .refine(date => !isNaN(date.getTime()), {
      message: 'Invalid date format'
    })
    .default(() => new Date().toISOString()),
  production_items: z
    .array(
      z.object({
        final_product_id: z
          .number()
          .int()
          .positive('Final product is required'),
        production_quantity_estimated: z
          .number()
          .int()
          .positive('Estimated quantity is required'),
        production_quantity_real: z
          .number()
          .int()
          .positive('Real quantity is required'),
        batch: z.string().min(3, 'Batch is required').optional(),
        batch_expiration: z
          .string()
          .transform(str => new Date(str))
          .refine(date => !isNaN(date.getTime()), {
            message: 'Invalid date format'
          })
      })
    )
    .optional()
});

export const UpdateProductionSchema = z.object({
  description: z.string().min(3, 'Description is required').optional(),
  production_date: z
    .string()
    .transform(str => new Date(str))
    .refine(date => !isNaN(date.getTime()), {
      message: 'Invalid date format'
    })
    .optional(),
  Production_Status: z.nativeEnum(Production_Status).optional(),
  production_items: z
    .array(
      z.object({
        id: z.number().int().positive('Item id is required'),
        production_quantity_estimated: z
          .number()
          .int()
          .positive('Estimated quantity is required')
          .optional(),
        production_quantity_real: z
          .number()
          .int()
          .positive('Real quantity is required')
          .optional()
      })
    )
    .optional()
});
