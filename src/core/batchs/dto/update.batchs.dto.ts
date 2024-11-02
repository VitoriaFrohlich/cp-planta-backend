import { Batch_Status } from 'src/core/common/enums';

export class UpdateBatchsDto {
  status: Batch_Status;
  updated_at: Date;
  updated_by?: string;
}
