export class BadRequestException extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = "BadRequestException";
    this.statusCode = 400;

    Object.setPrototypeOf(this, BadRequestException.prototype);
  }
}
