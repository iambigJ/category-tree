import { ConsoleLogger, Injectable, Scope } from '@nestjs/common';

export class MyLogger extends ConsoleLogger {
  constructor(context?: string) {
    super();
    this.setLogLevels(['log', 'error', 'warn', 'debug', 'verbose']);
    this.setContext(context);
  }
  log(message: string, ...optionalParams: [...any]) {
    super.log('📢 ' + message, optionalParams);
  }

  warn(message: string, ...optionalParams: [...any]) {
    super.warn('📢 ' + message, optionalParams);
  }
  debug(message: string, ...optionalParams: [...any]) {
    console.log(optionalParams);
    super.debug('📢 ' + message, optionalParams);
  }

  error(message: string, ...optionalParams: any[]) {
    super.error('📢 ' + message, ...optionalParams);
  }
}
