export interface ResponseStepDto {
  stepId: string;
  stepName: string;
  status: 'pending' | 'in-progress' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}
