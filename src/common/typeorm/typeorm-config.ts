import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';
import { DynamicModule } from '@nestjs/common';
import {Category} from "../../modules/category/entities/category.entity";

export function typeormConfig(): DynamicModule {
  return TypeOrmModule.forRootAsync({
    imports: [],
    useFactory: (config: ConfigService): DataSourceOptions => {
      const mytypeormConfig = config.get('database');
      return {
        type: 'mysql',
        host: mytypeormConfig['host'],
        port: mytypeormConfig['port'],
        username: mytypeormConfig['username'],
        password: mytypeormConfig['password'],
        database: mytypeormConfig['database'],
        migrations: [app.root + '/../migrations/*{.ts,.js}'], // Important: Point to your migrations folder

        entities: [Category],
        synchronize: mytypeormConfig['synchronize'] || true,
      };
    },
    inject: [ConfigService],
  });
}
