import * as z from 'zod';

export const BatchSchema = z.object({
  batch: z.string().min(3, 'Batch is required'),
  quantity: z.number().int().positive('Quantity is required')
});

const UpdateCompositionOrderItemSchema = z.object({
  id: z.number().int().positive('Id is required').optional(),
  raw_product: z.number().int().positive('Product is required'),
  quantity_received: z.number().int().positive('Quantity received is required'),
  used_batchs: z.record(BatchSchema).describe('Batches to use')
});

export const UpdateCompositionsSchema = z.object({
  composition_order_items: z.array(UpdateCompositionOrderItemSchema)
});
