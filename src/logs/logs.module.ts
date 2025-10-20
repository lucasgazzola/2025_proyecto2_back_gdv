import { Module } from '@nestjs/common';
import { LogsService } from './logs.service';
import { LogsController } from './logs.controller';
import { LogRepository } from './repositories/log.repository';
import { ILogRepositoryToken } from './repositories/log.repository.interface';

@Module({
  controllers: [LogsController],
  providers: [
    LogsService,
    {
      provide: ILogRepositoryToken,
      useClass: LogRepository,
    },
  ],
})
export class LogsModule {}
