export class UnknownDatabaseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnknownDatabaseError";
  }
}
