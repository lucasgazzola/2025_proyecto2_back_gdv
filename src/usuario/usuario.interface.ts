import { Role } from 'src/common/enums/roles.enums';

export interface User {
  id: number;
  email: string;
  name: string;
  lastname: string;
  password: string;
  role: Role;
}