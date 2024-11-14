import { ZodSchema } from 'zod';
import {
  CreateCategorySchema,
  UpdateCategorySchema
} from '../categories/dto/categories.schema';
import {
  CreateCompositionsSchema,
  UpdateCompositionsSchema
} from '../compositions/dto/compositions.schema';
import {
  CreateGroupSchema,
  UpdateGroupSchema
} from '../groups/dto/groups.schema';
import {
  CreateImageSchema,
  UpdateImageSchema
} from '../images/dto/images.schema';
import {
  CreateOccurrenceSchema,
  UpdateOccurrenceSchema
} from '../occurrences/dto/occurrences.schema';
import {
  CreatePersonsSchema,
  UpdatePersonsSchema
} from '../persons/dto/person.schema';
import {
  CreateProductionSchema,
  UpdateProductionSchema
} from '../production/dto/production.schema';
import {
  CreateProductionProgressSchema,
  UpdateProductionProgressSchema
} from '../production-progress/dto/production-progress.schema';
import {
  CreateProductionStepSchema,
  UpdateProductionStepSchema
} from '../production-steps/dto/production-steps.schema';
import {
  CreateProductSchema,
  UpdateProductSchema
} from '../products/dto/products.schema';
import {
  CreateStockSchema,
  UpdateStockSchema
} from '../stock/dto/stock.schema';
import {
  CreateStockLocationSchema,
  UpdateStockLocationSchema
} from '../stock-locations/dto/stock-location.schema';
import { CreateUserSchema, UpdateUserSchema } from '../users/dto/users.schema';

type SchemaMap = {
  [key: string]: ZodSchema;
};
export const ZodSchemasMap: SchemaMap = {
  //categories
  'POST:/categories/': CreateCategorySchema,
  'PATCH:/categories/': UpdateCategorySchema,
  //compositions
  'POST:/compositions/': CreateCompositionsSchema,
  'PATCH:/compositions/': UpdateCompositionsSchema,
  //groups
  'POST:/groups/': CreateGroupSchema,
  'PATCH:/groups/': UpdateGroupSchema,
  //images
  'POST:/images/': CreateImageSchema,
  'PATCH:/images/': UpdateImageSchema,
  //occurrences
  'POST:/occurrences/': CreateOccurrenceSchema,
  'PATCH:/occurrences/': UpdateOccurrenceSchema,
  //persons
  'POST:/persons/': CreatePersonsSchema,
  'PATCH:/persons/': UpdatePersonsSchema,
  //production
  'POST:/orders/': CreateProductionSchema,
  'PATCH:/orders/': UpdateProductionSchema,
  //production-progress
  'POST:/progress/': CreateProductionProgressSchema,
  'PATCH:/progress/': UpdateProductionProgressSchema,
  //production-steps
  'POST:/steps/': CreateProductionStepSchema,
  'PATCH:/steps/': UpdateProductionStepSchema,
  //products
  'POST:/products/raw': CreateProductSchema,
  'PATCH:/products/raw': UpdateProductSchema,
  //products
  'POST:/products/made': CreateProductSchema,
  'PATCH:/products/made': UpdateProductSchema,
  //stock
  'POST:/stock/': CreateStockSchema,
  'PATCH:/stock/': UpdateStockSchema,
  //stock-locations
  'POST:/stock-locations/': CreateStockLocationSchema,
  'PATCH:/stock-locations/': UpdateStockLocationSchema,
  //users
  'POST:/users/': CreateUserSchema,
  'PATCH:/users/': UpdateUserSchema
};
