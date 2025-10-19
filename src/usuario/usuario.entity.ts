import { Role } from 'src/common/enums/roles.enums';

export class User {
  public readonly id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  city?: string;
  province?: string;
  role: Role;
  isActive: boolean;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;
}