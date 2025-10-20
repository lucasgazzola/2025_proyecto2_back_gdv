import { User } from '../usuario.entity';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { Role } from 'src/common/enums/roles.enums';
import { UpdateUsuarioDto } from '../dto/update-usuario.dto';
import { Prisma } from '@prisma/client';

export class UsuarioMapper {

    static toDomain(user: any): any {
        return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone ?? undefined,
            address: user.address ?? undefined,
            city: user.city ?? undefined,
            province: user.province ?? undefined,
            role: user.role,
            isActive: user.isActive,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }

    static toCreatePersistance(dto: CreateUsuarioDto): any {
        return {
            email : dto.email,
            password: dto.password,
            firstName: dto.firstName,
            lastName: dto.lastName,
            phone: dto.phone ?? undefined,
            address: dto.address ?? undefined,
            city: dto.city ?? undefined,
            province: dto.province ?? undefined,
            role: dto.role ?? Role.USER,
        };
    }

    static toUpdatePersistance(dto: UpdateUsuarioDto): any {

        const data: Prisma.UserUpdateInput = {};
        if (dto.email !== undefined) data.email = dto.email;
        if (dto.password !== undefined) data.password = dto.password;
        if (dto.firstName !== undefined) data.firstName = dto.firstName;
        if (dto.lastName !== undefined) data.lastName = dto.lastName;
        if (dto.phone !== undefined) data.phone = dto.phone;
        if (dto.address !== undefined) data.address = dto.address;
        if (dto.city !== undefined) data.city = dto.city;
        if (dto.province !== undefined) data.province = dto.province;
        if (dto.isActive != undefined) data.isActive = dto.isActive;


        return data;
    }
}