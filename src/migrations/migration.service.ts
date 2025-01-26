import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { UnknownModuleException } from '@nestjs/core/errors/exceptions';

@Injectable()
export class MigrationService implements OnModuleInit {
  private readonly logger = new Logger(MigrationService.name);

  constructor(
    private dataSource: DataSource,
    private configService: ConfigService,
  ) {}

  async onModuleInit() {
    this.logger.log(
      'evolution has a destination not to combat nature but to supersede it  ',
    );
    await this.runMigrations();
  }

  async runMigrations() {
    if (this.configService.get<boolean>('MIGRATION') == true) {
      await this.dataSource
        .runMigrations({ transaction: 'all' })
        .then((res) => {
          this.logger.debug('Migrations completed.', res);
        })
        .catch((e) => {
          this.logger.error('Migration failed:', e?.stack, e.message);
          throw new UnknownModuleException(e?.message);
        });
    }
  }
}
