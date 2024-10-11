import * as z from 'zod';

export const CreatePersonsSchema = z.object({
  name: z.string().min(3, 'Description is required'),
  active: z.boolean().default(true)
});

export const UpdatePersonsSchema = z.object({
  name: z.string().min(3, 'Description is required'),
  active: z.boolean().default(true)
});
