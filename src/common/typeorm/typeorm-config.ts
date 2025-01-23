import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';
import { DynamicModule } from '@nestjs/common';

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
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: mytypeormConfig['synchronize'] || true,
      };
    },
    inject: [ConfigService],
  });
}
