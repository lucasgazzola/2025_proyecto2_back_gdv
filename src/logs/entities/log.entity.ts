import { LogStatus } from "src/common/enums/log-status.enums";
import { User } from "src/usuario/usuario.entity";

export class Log {

    id: number;
    status: LogStatus;
    action: string; 
    userId?: number;
    user?: User;
    details?: string;
    timestamp: Date;
}
