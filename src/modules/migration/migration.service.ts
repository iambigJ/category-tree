import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as path from 'path';

@Injectable()
export class MigrationService implements OnModuleInit {
  private readonly logger = new Logger(MigrationService.name);

  constructor(private dataSource: DataSource) {}

  async onModuleInit() {
    await this.runMigrations();
  }

  async runMigrations() {
    this.logger.log('Running migrations...');

    if(Process)
    await this.dataSource.runMigrations({ transaction: 'all' }); // or 'each' or 'none' as per your needs
    this.logger.log('Migrations completed.');
  }

  // Optional: Add a method to revert migrations if needed
  async revertLastMigration() {
    this.logger.log('Reverting last migration...');
    await this.dataSource.undoLastMigration();
    this.logger.log('Last migration reverted.');
  }
}
