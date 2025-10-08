export class DatabaseInitializationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DatabaseInitializationError";
  }
}
