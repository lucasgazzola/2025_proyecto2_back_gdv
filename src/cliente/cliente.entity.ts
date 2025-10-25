export class Cliente {
  constructor(
    public readonly id: number,
    public firstName: string,
    public lastName: string,
    public email: string,
    public dni: string,
    public isActive?: boolean,
    public phone?: string,
    public address?: string,
    public city?: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}
}
