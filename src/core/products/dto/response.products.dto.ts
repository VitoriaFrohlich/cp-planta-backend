import { Origin, Unit_Measure } from '../../common/enums';

export class ResponseProductsDto {
  id: number;
  description: string;
  code: string;
  sku: string;
  origin: Origin;
  unit_measure: Unit_Measure;
  category_id: number;
  group_id: number;
  supplier_id: number;
  nutritional_info: object;
  active: boolean;
  created_at: string;
  updated_at: string;
  //   created_by: number;
  //   updated_by: number;
  //   relationships - fazer na sequencia
  //     prices: Price[];
  //     categories: Category;
  //     groups: Group;
  //     persons: Person;
}

export class ShortResponseProductsDto {
  id: number;
  description: string;
}
