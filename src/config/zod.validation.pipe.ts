/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  PipeTransform,
  Injectable,
  BadRequestException,
  ArgumentMetadata
} from '@nestjs/common';
import { ZodSchema, ZodObject } from 'zod';
import { ZodSchemasMap } from '../core/common/zod.schemas.map';
import { filterExtraFields } from 'src/core/common/filter.fields';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  transform(value: any, _metadata: ArgumentMetadata) {
    if (value === undefined || value === null) {
      return value;
    }

    if (typeof value === 'object' && Object.keys(value).length === 0) {
      throw new BadRequestException('Houve um problema com seu request.');
    }

    const method = value.__method;
    let path = value.__path;

    if (!method || !path) {
      delete value.__method;
      delete value.__path;
      return value;
    }

    if (method === 'GET') {
      delete value.__method;
      delete value.__path;
      return value;
    }

    if (method === 'PATCH') {
      path = path.replace(/\d+$/, '');
    }

    const routeKey = `${method}:${path}`;

    const schema = ZodSchemasMap[routeKey] as ZodSchema<any>;
    if (!schema) {
      delete value.__method;
      delete value.__path;
      return value;
    }

    const filteredData = filterExtraFields(value, schema as ZodObject<any>);

    const validationResult = schema.safeParse(filteredData);
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));

      throw new BadRequestException({
        message: 'Erro de validação',
        data: errors
      });
    }

    delete value.__method;
    delete value.__path;

    return filteredData;
  }
}
