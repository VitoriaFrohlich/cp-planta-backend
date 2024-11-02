import * as z from 'zod';

export const CreateImageSchema = z.object({
  hash: z.string().min(3, 'Hash is required'),
  image_bin: z.array(z.string()).min(1, 'Image binary is required'),
  path: z.string().min(3, 'Path is required'),
  mime_type: z.string().min(3, 'Mime type is required'),
  file_name: z.string().min(3, 'File name is required'),
  original_name: z.string().min(3, 'Original name is required'),
  size: z.number().int().positive().optional(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  metadata: z.object({}).nullable(),
  steps_progress: z.number().int().nullable().default(null),
  stock_item: z.number().int().nullable().default(null),
  product: z.number().int().nullable().default(null),
  created_at: z.string().default(new Date().toISOString()),
  updated_at: z.string().default(new Date().toISOString()),
  created_by: z.string().default('root'),
  updated_by: z.string().default('root')
});

export const UpdateImageSchema = z.object({
  path: z.string().min(3, 'Path is required').optional(),
  steps_progress: z.number().int().nullable().optional(),
  stock_item: z.number().int().nullable().optional(),
  product: z.number().int().nullable().optional(),
  updated_at: z.string().default(new Date().toISOString()),
  updated_by: z.number().int().nullable()
});
