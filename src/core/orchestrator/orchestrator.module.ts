import { Module, Global, DynamicModule } from '@nestjs/common';
import { OrchestratorService } from './orchestrator.service';
import { OrchestratorController } from './orchestrator.controller';
import { PrismaModule } from 'src/database/prisma/prisma.module';

@Global()
@Module({
  imports: [PrismaModule],
  controllers: [OrchestratorController],
  providers: [OrchestratorService],
  exports: [OrchestratorService]
})
export class OrchestratorModule {
  static forRoot(): DynamicModule {
    return {
      module: OrchestratorModule,
      global: true
    };
  }
}
