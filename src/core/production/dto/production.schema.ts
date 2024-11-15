import { Production_Status } from 'src/core/common/enums';
import * as z from 'zod';

export const CreateProductionSchema = z.object({
  production_date: z
    .string()
    .transform(str => new Date(str))
    .refine(date => !isNaN(date.getTime()), {
      message: 'Invalid date format'
    }),
  final_product_id: z.number().int().positive('Final product ID is required'),
  production_quantity_estimated: z
    .number()
    .int()
    .positive('Estimated production quantity is required'),
  production_items: z
    .array(
      z.object({
        raw_product_id: z.number().int().positive('Raw product ID is required'),
        used_batchs: z.array(
          z.object({
            stock_item_id: z
              .number()
              .int()
              .positive('Stock item ID is required'),
            batch: z.string().min(3, 'Batch is required'),
            quantity: z.number().int().positive('Quantity is required')
          })
        )
      })
    )
    .optional()
});

export const UpdateProductionSchema = z.object({
  production_date: z
    .string()
    .transform(str => new Date(str))
    .refine(date => !isNaN(date.getTime()), {
      message: 'Invalid date format'
    })
    .optional(),
  Production_Status: z.nativeEnum(Production_Status).optional(),
  production_quantity_estimated: z
    .number()
    .int()
    .positive('Estimated production quantity is required'),
  production_items: z
    .array(
      z.object({
        id: z.number().int().positive('Item ID is required'),
        raw_product_id: z
          .number()
          .int()
          .positive('Raw product ID is required')
          .optional(),
        used_batchs: z
          .array(
            z.object({
              stock_item_id: z
                .number()
                .int()
                .positive('Stock item ID is required')
                .optional(),
              batch: z.string().min(3, 'Batch is required').optional(),
              quantity: z
                .number()
                .int()
                .positive('Quantity is required')
                .optional()
            })
          )
          .optional()
      })
    )
    .optional()
});
