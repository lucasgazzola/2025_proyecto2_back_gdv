import { Module, forwardRef } from '@nestjs/common';
import { LogsService } from './logs.service';
import { LogsController } from './logs.controller';
import { LogRepository } from './repositories/log.repository';
import { ILogRepositoryToken } from './repositories/log.repository.interface';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [LogsController],
  providers: [
    LogsService,
    {
      provide: ILogRepositoryToken,
      useClass: LogRepository,
    },
  ],
  exports: [LogsService],
})
export class LogsModule {}
