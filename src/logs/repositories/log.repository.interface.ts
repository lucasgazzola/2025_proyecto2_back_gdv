import { CreateLogDto } from "../dto/create-log.dto";
import { Log } from "../entities/log.entity";

export const ILogRepositoryToken = 'ILogRepository';

export interface ILogRepository {
    create(dto: CreateLogDto): Promise<Log>;
    findAll(): Promise<Log[]>
}