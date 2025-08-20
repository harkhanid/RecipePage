export class CustomError extends Error {
  constructor(message, statusCode = 400, details = null) {
    super(message);
    this.isCustom = true;
    this.statusCode = statusCode;
    this.details = details;
  }
}
