import { pipe } from './pipe';

export abstract class Result<T, E> {
  abstract isOk(): boolean;
  abstract isErr(): boolean;

  /** Transform the successful value, if any */
  abstract map<U>(fn: (value: T) => U): Result<U, E>;

  /** Chain the result with another computation that returns a Result */
  abstract chain<U>(fn: (value: T) => Result<U, E>): Result<U, E>;

  /** Unwrap the value or return a default if it's an error */
  abstract unwrapOr(defaultValue: T): T;

  /** Throw error if trying to unwrap a failure (optional utility) */
  abstract unwrap(): T;

  /** Perform a side effect on the Ok value without changing the Result */
  abstract tap(fn: (value: T) => void): Result<T, E>;

  /** Perform a side effect on the Err value without changing the Result */
  abstract tapErr(fn: (error: E) => void): Result<T, E>;

  /**
   * Apply a series of operations to the Result.
   * Uses the external pipe function for type-safe chaining.
   */
  abstract pipe<A>(op1: (value: T) => Result<A, E>): Result<A, E>;
  abstract pipe<A, B>(
    op1: (value: T) => Result<A, E>,
    op2: (value: A) => Result<B, E>
  ): Result<B, E>;
  abstract pipe<A, B, C>(
    op1: (value: T) => Result<A, E>,
    op2: (value: A) => Result<B, E>,
    op3: (value: B) => Result<C, E>
  ): Result<C, E>;
  // Add more overloads if needed

  /** Static helper to create an Ok value */
  static ok<T, E = unknown>(value: T): Result<T, E> {
    return new Ok(value);
  }

  /** Static helper to create an Err value */
  static err<T = never, E = unknown>(error: E): Result<T, E> {
    return new Err(error);
  }

  /** Static helper to create an Ok / Err value from an unsafe function */
  static tryCatch<T, E = unknown>(
    fn: () => T,
    onError?: (error: unknown) => E
  ): Result<T, E> {
    try {
      return Result.ok(fn());
    } catch (error) {
      return Result.err(onError ? onError(error) : (error as E));
    }
  }

  /** Static helper to create an Ok / Err<AppError> value from an unsafe function */
  static try<T, E extends AppError>(fn: () => T, err: E): Result<T, E> {
    try {
      return Result.ok(fn());
    } catch (error) {
      return Result.err(err);
    }
  }
}

export class Ok<T, E> extends Result<T, E> {
  constructor(private value: T) {
    super();
  }

  isOk(): boolean {
    return true;
  }

  isErr(): boolean {
    return false;
  }

  /** Apply the function to the value and wrap the result in Ok */
  map<U>(fn: (value: T) => U): Result<U, E> {
    return new Ok(fn(this.value));
  }

  /** Chain the result with the provided function */
  chain<U>(fn: (value: T) => Result<U, E>): Result<U, E> {
    return fn(this.value);
  }

  unwrapOr(_: T): T {
    return this.value;
  }

  unwrap(): T {
    return this.value;
  }

  tap(fn: (value: T) => void): Result<T, E> {
    fn(this.value);
    return this;
  }

  tapErr(_: (error: E) => void): Result<T, E> {
    return this; // Do nothing on Err for Ok
  }

  pipe(...operations: any[]): Result<any, E> {
    // @ts-ignore - Overloads are handled by the abstract class definition
    return pipe(this, ...operations);
  }

  toString(): string {
    return `Ok(${this.value})`;
  }
}

export class Err<T, E> extends Result<T, E> {
  constructor(private error: E) {
    super();
  }

  isOk(): boolean {
    return false;
  }

  isErr(): boolean {
    return true;
  }

  /** If the result is an error, mapping does nothing */
  map<U>(_: (value: T) => U): Result<U, E> {
    return new Err(this.error);
  }

  /** Chaining will propagate the error without calling the function */
  chain<U>(_: (value: T) => Result<U, E>): Result<U, E> {
    return new Err(this.error);
  }

  // Return a default value since this is an error.
  unwrapOr(defaultValue: T): T {
    return defaultValue;
  }

  unwrap(): T {
    throw new Error(`Tried to unwrap an Err: ${this.error}`);
  }

  tap(_: (value: T) => void): Result<T, E> {
    return this; // Do nothing on Ok for Err
  }

  tapErr(fn: (error: E) => void): Result<T, E> {
    fn(this.error);
    return this;
  }

  pipe(...operations: any[]): Result<any, E> {
    // @ts-ignore - Overloads are handled by the abstract class definition
    return pipe(this, ...operations);
  }

  toString(): string {
    return `Err(${this.error})`;
  }
}
