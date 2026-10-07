export abstract class AppError extends Error {
  public abstract readonly statusCode: number;
  public abstract readonly errorCode: string;
  public readonly details?: unknown;

  constructor(message: string, details?: unknown) {
    super(message);
    this.name = this.constructor.name;
    this.details = details;
    if (typeof (Error as any).captureStackTrace === 'function') {
      (Error as any).captureStackTrace(this, this.constructor);
    }
  }
}

export class NotFoundError extends AppError {
  public readonly statusCode = 404;
  public readonly errorCode = 'NOT_FOUND';
  constructor(message = 'Resource not found', details?: unknown) {
    super(message, details);
  }
}

export class ConflictError extends AppError {
  public readonly statusCode = 409;
  public readonly errorCode = 'CONFLICT';
  constructor(message = 'Resource conflict or already exists', details?: unknown) {
    super(message, details);
  }
}

export class ValidationError extends AppError {
  public readonly statusCode = 400;
  public readonly errorCode = 'VALIDATION_FAILED';
  constructor(message = 'Validation failed', details?: unknown) {
    super(message, details);
  }
}

export class UnauthorizedError extends AppError {
  public readonly statusCode = 401;
  public readonly errorCode = 'UNAUTHORIZED';
  constructor(message = 'Authentication required', details?: unknown) {
    super(message, details);
  }
}

export class ForbiddenError extends AppError {
  public readonly statusCode = 403;
  public readonly errorCode = 'FORBIDDEN';
  constructor(message = 'Access forbidden: insufficient permissions', details?: unknown) {
    super(message, details);
  }
}

export class BusinessRuleViolationError extends AppError {
  public readonly statusCode = 422;
  public readonly errorCode = 'BUSINESS_RULE_VIOLATION';
  constructor(message = 'Operation blocked by business rule engine', details?: unknown) {
    super(message, details);
  }
}
