// + More structured error messages
// + Predefined errors with code
// + Ability to provide additional context

export class CustomAppError extends Error implements AppError {
  constructor(public code: number, public message: string) {
    super(message);
  }

  withMsg(message: string, replace?: boolean): CustomAppError {
    return new CustomAppError(
      this.code,
      replace ? message : `${this.message}\n${message}`
    );
  }

  toString(): string {
    return `Custom App Error [${this.code}]: ${this.message}`;
  }
}

export const ERRORS = {
  // REST
  REST_FETCH_ERROR: new CustomAppError(100, 'User was not fetched.'),
  // FUNCTIONS
  FUNC_PARSE_ERROR: new CustomAppError(200, 'Invalid JSON input.'),
  // REPOSITORY
  REPO_NODE_NOT_FOUND: new CustomAppError(300, 'Node was not found.'),
} as const;
