import * as z from 'zod';

export const CreateOccurrenceSchema = z.object({
  description: z
    .string()
    .min(10, 'Descrição deve conter no mínimo 10 caracteres')
});

export const UpdateOccurrenceSchema = z.object({
  description: z
    .string()
    .min(10, 'Descrição deve conter no mínimo 10 caracteres')
    .optional()
});
