import { Module } from '@nestjs/common';
import { GlobalConfigModule } from './common/config/config-module';
import { typeormConfig } from './common/typeorm/typeorm-config';
import { CategoryModule } from './modules/category/category.module';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './common/filters/global-exeption';
import { MigrationService } from './migrations/migration.service';

@Module({
  imports: [GlobalConfigModule, typeormConfig(), CategoryModule],
  providers: [
    MigrationService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
