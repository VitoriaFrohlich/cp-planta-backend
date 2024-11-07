import * as z from 'zod';

export const CreateGroupSchema = z.object({
  description: z.string().min(3, 'Description is required'),
  father_id: z.number().nullable().optional(),
  active: z.boolean().default(true)
});

export const UpdateGroupSchema = z.object({
  description: z.string().min(3, 'Description is required'),
  father_id: z.number().nullable().optional(),
  active: z.boolean().default(true)
});
