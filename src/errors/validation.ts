export class ValidationError extends Error {
  statusCode: number;
  errors: Array<{ error?: string; name?: string }>;

  constructor(
    statusCode: number,
    message: string,
    errors: Array<{ error?: string; name?: string }> = []
  ) {
    super(message);
    this.name = "ValidationError";
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

export interface ErrorResponseData {
  errors: Array<{ error?: string; name?: string }>;
}
