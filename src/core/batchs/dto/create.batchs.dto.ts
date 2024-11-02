import { Batch_Status } from 'src/core/common/enums';

export class CreateBatchsDto {
  batch: string;
  status: Batch_Status;
  created_at: Date;
  updated_at: Date;
  created_by?: string;
  updated_by?: string;
}
