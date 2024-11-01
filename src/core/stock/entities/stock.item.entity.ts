import { Stock } from './stock.entity';

export class StockItem {
  id: number;
  stock_id: number;
  sequence: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  total_price: number;
  lote: string;
  expiration: Date;
  persons: number;
  costumers: number;
  stock_location_id: number;
  observation: string;
  created_at: Date;
  updated_at: Date;
  customers: number;
  products: number;
  stock: Stock;
  stock_location: number;
  suppliers_stock_items_suppliersTosuppliers: number;
}
