import { Owner } from 'src/core/common/enums';

export class Image {
  id: number;
  hash: string;
  path: string;
  mime_type: string;
  file_name: string;
  original_name: string;
  size: number;
  width: number;
  height: number;
  metadata: object;
  owner: Owner;
  owner_id: number;
  created_at: Date;
  updated_at: Date;
  created_by: string;
  updated_by: string;
}
