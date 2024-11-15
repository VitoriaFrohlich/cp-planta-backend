import * as z from 'zod';
const CompositionItemSchema = z.object({
  raw_product: z.number().int().positive('Product is required'),
  quantity: z.number().int().positive('Quantity is required')
});

export const StepSchema = z.object({
  sequence: z.number().int().positive('Sequence is required'),
  id: z.number().int().positive('Id is required'),
  description: z.string().min(3, 'Description is required')
});

export const CreateCompositionsSchema = z.object({
  final_product: z
    .number()
    .int()
    .positive('Final Product is required')
    .describe('Produto final incluído na composição.'),
  production_steps: z
    .array(StepSchema)
    .describe('Passos de produção da composição.'),
  composition_items: z.array(CompositionItemSchema)
});

const UpdateCompositionItemSchema = z.object({
  quantity: z.number().int().positive('Quantity is required')
});

export const UpdateCompositionsSchema = z.object({
  description: z.string().min(3, 'Description is required').optional(),
  production_steps: z
    .array(StepSchema)
    .describe('Passos de produção da composição.'),
  composition_items: z.array(
    UpdateCompositionItemSchema.extend({
      id: z.number().int().positive('Id is required').optional()
    })
  )
});
