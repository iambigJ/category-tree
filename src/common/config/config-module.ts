import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as yaml from 'yaml';
import * as fs from 'fs';
import * as path from 'path';
import * as appRoot from 'app-root-path';

const configFilePath = path.join(appRoot.path, 'config.yaml');
console.log('config file path is')
console.log(configFilePath)
const configYaml = yaml.parse(fs.readFileSync(configFilePath, 'utf8'));

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => configYaml],
    }),
  ],
})
export class GlobalConfigModule {}
