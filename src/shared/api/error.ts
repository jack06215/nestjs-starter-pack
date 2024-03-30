interface DefaultErrorParams {
  statusCode: string | number;
  message: string;
}

export class BaseError extends Error {
  public readonly statusCode: string | number;

  constructor(private e: DefaultErrorParams) {
    super(e.message);
    this.statusCode = e.statusCode || 'NO_STATUS_CODE';
  }
}

export class ResourceNotFound extends BaseError {
  constructor(message?: string) {
    super({
      message: message || 'Resource not found',
      statusCode: 'ERROR_RESOURCE_NOT_FOUND',
    });
  }
}

export class ResourceAlreadyExists extends BaseError {
  constructor(message?: string) {
    super({
      message: message || 'Resource of type already exists.',
      statusCode: 'ERROR_RESOURCE_ALREADY_EXISTS',
    });
  }
}
