export class ResponseImagesDto {
  id: number;
  hash: string;
  path: string;
  mime_type: string;
  file_name: string;
  original_name?: string;
  size?: number;
  width?: number;
  height?: number;
  steps_progress?: number;
  stock_item?: number;
  product?: number;
  created_at: string;
  updated_at: string;
}
