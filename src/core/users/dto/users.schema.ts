import { Gender, Role } from 'src/core/common/enums';
import * as z from 'zod';

export const CreateUserSchema = z.object({
  email: z.string().email('Email is required'),
  password: z.string().min(6, 'Password is required'),
  role: z.nativeEnum(Role).default(Role.DEFAULT).optional()
});

export const UpdateUserSchema = z.object({
  username: z.string().min(3, 'Name is required').optional(),
  email: z.string().email('Email is required').optional(),
  password: z.string().min(6, 'Password is required').optional(),
  role: z.nativeEnum(Role).default(Role.DEFAULT).optional(),
  first_name: z.string().min(3, 'First name is required').optional(),
  last_name: z.string().min(3, 'Last name is required').optional(),
  gender: z.nativeEnum(Gender).default(Gender.OTHER).optional(),
  active: z.boolean().default(true).optional()
});
