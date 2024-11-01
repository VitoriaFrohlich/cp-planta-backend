import * as z from 'zod';

export const CreateStockSchema = z.object({
  document_date: z.date().default(new Date()),
  stock_moviment: z.string().min(3, 'Stock moviment is required'),
  stock_id: z.number().int().positive('Reference for stock is required'),
  sequence: z.number().int().positive('Sequence is required'),
  product_id: z.number().int().positive('Product is required'),
  quantity: z.number().int().positive('Quantity is required'),
  unit_price: z.number().int().positive('Unit price is required').optional(),
  total_price: z.number().int().positive('Total price is required').optional(),
  lote: z.string().min(3, 'Lote is required'),
  expiration: z.date(),
  supplier: z.number().int().positive('Supplier is required').optional(),
  costumer: z.number().int().positive('Costumer is required').optional(),
  stock_location_id: z
    .number()
    .int()
    .positive('Stock location is required')
    .default(1),
  observation: z.string().min(3, 'Observation is required').optional()
});

export const UpdateStockSchema = z.object({
  quantity: z.number().int().positive('Quantity is required').optional(),
  unit_price: z.number().int().positive('Unit price is required').optional(),
  total_price: z.number().int().positive('Total price is required').optional(),
  lote: z.string().min(3, 'Lote is required').optional(),
  expiration: z.date().optional(),
  supplier: z.number().int().positive('Supplier is required').optional(),
  costumer: z.number().int().positive('Costumer is required').optional(),
  stock_location_id: z
    .number()
    .int()
    .positive('Stock location is required')
    .optional(),
  observation: z.string().min(3, 'Observation is required').optional()
});
