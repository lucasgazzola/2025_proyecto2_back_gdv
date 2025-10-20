import { Log } from "../entities/log.entity";
import { CreateLogDto } from "../dto/create-log.dto";

export class LogMapper {
    static toDomain(data: any): Log {
        return {
            id: data.id,
            status: data.status,
            action: data.action,
            userId: data.userId,
            user: data.user,
            details: data.details,
            timestamp: data.timestamp,
        };
    }

    static toCreatePersistance(dto: CreateLogDto): any {
        return {
            status: dto.status,
            action: dto.action,
            user: dto.userId ? { connect: { id: dto.userId } }: undefined,
            details: dto.details ?? undefined,
        }
    }
}