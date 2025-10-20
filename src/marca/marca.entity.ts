export class Marca {
  constructor(
    public readonly id: number,
    public name: string,
    public readonly updatedAt: Date,
    public readonly createdAt: Date,
    public logo?: string,
    public description?: string,
    public isActive?: boolean,
  ){}
}
