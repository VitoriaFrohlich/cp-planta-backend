import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './core/users/users.module';
import { ProductsModule } from './core/products/products.module';
import { ProductionModule } from './core/production/production.module';
import { StockModule } from './core/stock/stock.module';
import { AuthModule } from './auth/auth.module';
import { ControlPanelController } from './control-panel/control-panel.controller';
import { ControlPanelModule } from './control-panel/control-panel.module';
import { Config } from './config/config.module';
import { PrismaModule } from './database/prisma/prisma.module';
import { PrismaService } from './database/prisma/prisma.service';
import { FeatureFlagsService } from './feature-flags/feature-flags.service';
import { CategoriesModule } from './core/categories/categories.module';
// import { PersonsModule } from './core/persons/persons.module';
//import { GroupsModule } from './core/groups/groups.module';
// import { CompositionsModule } from './core/compositions/compositions.module';
// usar
@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    ProductsModule,
    ProductionModule,
    StockModule,
    AuthModule,
    ControlPanelModule,
    Config,
    PrismaModule,
    CategoriesModule
    // PersonsModule,
    // CompositionsModule
  ],
  controllers: [ControlPanelController],
  providers: [PrismaService, FeatureFlagsService]
})
export class AppModule {}
