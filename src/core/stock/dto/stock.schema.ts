import { Stock_Moviment } from 'src/core/common/enums';
import * as z from 'zod';

export const CreateStockSchema = z.object({
  stock_moviment: z.nativeEnum(Stock_Moviment),
  stock_items: z.array(
    z.object({
      product_id: z.number().int().positive('Product is required'),
      quantity: z.number().int().positive('Quantity is required'),
      unit_price: z
        .number()
        .int()
        .positive('Unit price is required')
        .optional(),
      batch: z.string().min(3, 'Batch is required'),
      batch_expiration: z
        .string()
        .transform(str => new Date(str))
        .refine(date => !isNaN(date.getTime()), {
          message: 'Invalid expiration date format'
        }),
      sku: z.string().min(3, 'SKU is required'),
      supplier: z.number().int().positive('Supplier is required').optional(),
      costumer: z.number().int().positive('Costumer is required').optional(),
      stock_location_id: z
        .number()
        .int()
        .positive('Stock location is required')
        .default(1),
      observation: z.string().min(3, 'Observation is required').optional()
    })
  )
});

export const UpdateStockSchema = z.object({
  stock_items: z.array(
    z.object({
      id: z.number().int().positive('Invalid stock item id'),
      unit_price: z
        .number()
        .int()
        .positive('Unit price is required')
        .optional(),
      supplier: z.number().int().positive('Supplier is required').optional(),
      costumer: z.number().int().positive('Costumer is required').optional(),
      stock_location_id: z
        .number()
        .int()
        .positive('Stock location is required')
        .default(1),
      observation: z.string().min(3, 'Observation is required').optional()
    })
  )
});
