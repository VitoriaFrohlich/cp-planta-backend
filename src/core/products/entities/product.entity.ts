import { Origin, Unit_Measure } from '../../common/enums';
export class Product {
  id: number;
  description: string;
  code: string;
  origin: Origin;
  unit_measure: Unit_Measure;
  category_id: number;
  group_id: number;
  supplier_id: number;
  nutritional_info: string;
  active: boolean;
  created_at: Date;
  updated_at: Date;
  created_by: string;
  updated_by: string;
  // relationships - fazer na sequencia
  //   prices: Price[];
  //   categories: Category;
  //   groups: Group;
  //   persons: Person;
}
