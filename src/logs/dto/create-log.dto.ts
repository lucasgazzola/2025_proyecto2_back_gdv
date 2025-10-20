import { LogStatus } from "src/common/enums/log-status.enums";
import { IsEnum, IsInt, IsOptional, IsString } from "class-validator";

export class CreateLogDto {

    @IsEnum(LogStatus)
    status: LogStatus;

    @IsString()
    action: String;

    @IsInt()
    @IsOptional()
    userId?: number;

    @IsString()
    @IsOptional()
    details?: string;

}
