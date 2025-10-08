export class InternalServerException extends Error {
  public statusCode: number;

  constructor(message: string = "Internal Server Error") {
    super(message);
    this.name = "InternalServerException";
    this.statusCode = 500;

    Object.setPrototypeOf(this, InternalServerException.prototype);
  }
}
