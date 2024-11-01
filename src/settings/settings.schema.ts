import * as z from 'zod';

export const SettingsSchema = z.object({
  key: z.string(),
  value: z.string(),
  active: z.boolean(),
  description: z.string(),
  created_by: z.string(),
  created_at: z.date(),
  updated_by: z.string(),
  updated_at: z.date()
});
