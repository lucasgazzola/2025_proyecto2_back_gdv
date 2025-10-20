import { Injectable } from "@nestjs/common";
import { ILogRepository } from "./log.repository.interface";
import { CreateLogDto } from "../dto/create-log.dto";
import { Log } from "../entities/log.entity";
import { prisma } from "src/common/config/db-client";
import { LogMapper } from "../mapper/log.mapper";

@Injectable()
export class LogRepository implements ILogRepository {

    async create(dto: CreateLogDto): Promise<Log> {

        const log = await prisma.log.create({ data: LogMapper.toCreatePersistance(dto) });
        
        return LogMapper.toDomain(log);
    }

    async findAll(): Promise<Log[]> {

        const logs = await prisma.log.findMany({ include: { user: true } });
        
        return logs.map(LogMapper.toDomain);
    }
}