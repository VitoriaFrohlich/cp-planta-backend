import * as z from 'zod';

export const UpdateSettingsSchema = z.object({
  value: z.string(),
  active: z.boolean().optional()
});
