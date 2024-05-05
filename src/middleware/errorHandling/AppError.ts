export default class AppError extends Error {
  constructor(
    public errorCode: string,
    public message: string,
    public statusCode: number,
  ) {
    super(message);
    this.errorCode = errorCode;
    this.statusCode = statusCode;
  }
}
