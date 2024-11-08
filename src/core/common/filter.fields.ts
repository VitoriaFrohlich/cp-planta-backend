/* eslint-disable @typescript-eslint/no-explicit-any */

import * as z from 'zod';

/**
 * Filtra e remove os campos extras com base no schema Zod
 * @param data - Dados recebidos na requisição
 * @param schema - Schema Zod utilizado para validação
 * @returns Objeto com apenas os campos permitidos pelo schema
 */
export const filterExtraFields = (data: any, schema: z.ZodObject<any>): any => {
  // Obtém as chaves permitidas definidas no schema Zod
  const allowedKeys = Object.keys(schema.shape);

  // Cria um novo objeto apenas com os campos permitidos
  const filteredData = allowedKeys.reduce((acc, key) => {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      acc[key] = data[key]; // Inclui o campo se ele existir em 'data'
    }
    return acc;
  }, {});

  return filteredData; // Retorna o objeto filtrado
};
