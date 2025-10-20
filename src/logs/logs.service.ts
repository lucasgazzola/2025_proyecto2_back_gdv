import { Injectable, Inject } from '@nestjs/common';
import { CreateLogDto } from './dto/create-log.dto';
import type { ILogRepository } from './repositories/log.repository.interface';
import { ILogRepositoryToken } from './repositories/log.repository.interface';
import { LogStatus } from 'src/common/enums/log-status.enums';
import { Log } from './entities/log.entity';

@Injectable()
export class LogsService {

  constructor(
    @Inject(ILogRepositoryToken)
    private readonly logRepository: ILogRepository
  ) {}

  create(createLogDto: CreateLogDto) {
    return this.logRepository.create(createLogDto);
  }

  findAll() {
    return this.logRepository.findAll();
  }

  async createSuccessLog(action: string, userId?: number, details?: string) {
    return this.create({
      status: LogStatus.SUCCESS,
      action,
      userId,
      details,
    });
  }

  async createInfoLog(action: string, userId?: number, details?: string) {
    return this.create({
      status: LogStatus.INFO,
      action,
      userId,
      details,
    });
  }

  async createFailureLog(action: string, userId?: number, details?: string) {
    return this.create({
      status: LogStatus.FAILURE,
      action,
      userId,
      details,
    });
  }

}
