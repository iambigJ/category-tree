import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';
import { DynamicModule } from '@nestjs/common';
import { Category } from '../../modules/category/entities/category.entity';
import { join } from 'path';
import * as appRoot from 'app-root-path';

export function typeormConfig(): DynamicModule {
  return TypeOrmModule.forRootAsync({
    imports: [],
    useFactory: (config: ConfigService): DataSourceOptions => {
      const mytypeormConfig = config.get('DATA_BASE');
      return {
        type: 'mysql',
        host: mytypeormConfig['host'],
        port: mytypeormConfig['port'],
        username: mytypeormConfig['username'],
        password: mytypeormConfig['password'],
        database: mytypeormConfig['database'],
        migrations: [join(appRoot.path, './migrations', '*.migration.js')],
        entities: [Category],
        synchronize: false,
      };
    },
    inject: [ConfigService],
  });
}

console.log(join(appRoot.path, './migrations', '*.migration.{ts}'))
