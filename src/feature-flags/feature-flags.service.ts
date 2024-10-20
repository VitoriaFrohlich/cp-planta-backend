import { Injectable } from '@nestjs/common';

@Injectable()
export class FeatureFlagsService {
  private features = {
    'public-feature': ['DEMO', 'ADMIN', 'ROOT', 'DEFAULT'],
    'admin-feature': ['ADMIN', 'ROOT']
  };

  isFeatureEnabled(userRole: string, feature: string): boolean {
    return this.features[feature]?.includes(userRole);
  }
}
