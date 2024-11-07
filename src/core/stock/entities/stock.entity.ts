import { Stock_Moviment } from '../../common/enums';
import { StockItem } from './stock.item.entity';

export class Stock {
  id: number;
  document_number: string;
  document_date: Date;
  stock_moviment: Stock_Moviment;
  created_at: Date;
  updated_at: Date;
  created_by: string;
  updated_by: string;
  stock_items: StockItem[];
}
