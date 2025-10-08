export class UnauthorizedException extends Error {
  public statusCode: number;

  constructor(message: string = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedException";
    this.statusCode = 401;

    Object.setPrototypeOf(this, UnauthorizedException.prototype);
  }
}
