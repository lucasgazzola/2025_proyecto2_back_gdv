import { Injectable, PipeTransform, ArgumentMetadata, BadRequestException } from "@nestjs/common";

@Injectable()
export class ParseIntPipe implements PipeTransform<string, number> {
    transform(value: string, metadata: ArgumentMetadata): number {
        
        const val = parseInt(value, 10);
        
        if (isNaN(val)) {
            throw new BadRequestException(`El parámetro ${metadata.data} no es un número`);
        }
        
        if (val <= 0) {
            throw new BadRequestException(`El parámetro ${metadata.data} debe ser mayor a 0`);
        }
        
        return val;
    }
}