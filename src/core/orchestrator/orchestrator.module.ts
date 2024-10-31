import { Module, Global, DynamicModule } from '@nestjs/common';
import { OrchestratorService } from './orchestrator.service';
import { OrchestratorController } from './orchestrator.controller';
import { OrchestratorRepository } from './orchestrator.repository';
import { PrismaModule } from 'src/database/prisma/prisma.module';

@Global()
@Module({
  imports: [PrismaModule],
  controllers: [OrchestratorController],
  providers: [OrchestratorService, OrchestratorRepository],
  exports: [OrchestratorService, OrchestratorRepository]
})
export class OrchestratorModule {
  static forRoot(): DynamicModule {
    return {
      module: OrchestratorModule,
      global: true
    };
  }
}
