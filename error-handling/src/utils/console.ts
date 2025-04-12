import { Result } from './rust';

export class Console {
  private constructor() {}

  private static logResult<T, E>(
    result: Result<T, E>,
    logFn: (...data: any[]) => void,
    errorFn: (...data: any[]) => void = console.error
  ): Result<T, E> {
    if (result.isOk()) {
      logFn('Ok:', result.unwrap());
    } else if (result.isErr()) {
      // Safely access the error - assuming Err<T, E> has an 'error' property or method
      try {
        // Attempt to access error, assuming Err might throw if improperly accessed
        // or if the error structure is unknown. This is a defensive approach.
        // If Err class guarantees access to the error value (e.g., via a method or property),
        // use that directly. Example: errorFn('Err:', (result as Err<T, E>).error);
        // For now, we'll rely on the default unwrap behavior which throws for Err.
        result.unwrap(); // This line is expected to throw for Err type
      } catch (errorValue) {
        // We catch the thrown error which contains the wrapped error value
        errorFn('Err:', errorValue);
      }
    }
    return result;
  }

  static log<T, E>(result: Result<T, E>): Result<T, E> {
    return Console.logResult(result, console.log, console.error);
  }

  static info<T, E>(result: Result<T, E>): Result<T, E> {
    return Console.logResult(result, console.info, console.error);
  }

  static warn<T, E>(result: Result<T, E>): Result<T, E> {
    return Console.logResult(result, console.warn, console.warn); // Log warnings using console.warn
  }

  static error<T, E>(result: Result<T, E>): Result<T, E> {
    // For error, always log with console.error regardless of Ok/Err
    if (result.isOk()) {
      console.error('Ok (logged as error):', result.unwrap());
    } else {
      try {
        result.unwrap();
      } catch (errorValue) {
        console.error('Err:', errorValue);
      }
    }
    return result;
  }

  static debug<T, E>(result: Result<T, E>): Result<T, E> {
    return Console.logResult(result, console.debug, console.debug); // Log debug using console.debug
  }

  /** Returns a function suitable for Result.tap to log the Ok value. */
  static logTap<T>(): (value: T) => void {
    return (value: T) => console.log('Ok (tap):', value);
  }

  /** Returns a function suitable for Result.tapErr to log the Err value. */
  static errorTap<E>(): (error: E) => void {
    return (error: E) => console.error('Err (tapErr):', error);
  }

  /** Returns a function suitable for Result.tap to log the Ok value using console.info. */
  static infoTap<T>(): (value: T) => void {
    return (value: T) => console.info('Info (tap):', value);
  }

  /** Returns a function suitable for Result.tap to log the Ok value using console.warn. */
  static warnTap<T>(): (value: T) => void {
    return (value: T) => console.warn('Warn (tap):', value);
  }

  /** Returns a function suitable for Result.tapErr to log the Err value using console.warn. */
  static warnTapErr<E>(): (error: E) => void {
    return (error: E) => console.warn('Warn (tapErr):', error);
  }

  /** Returns a function suitable for Result.tap to log the Ok value using console.debug. */
  static debugTap<T>(): (value: T) => void {
    return (value: T) => console.debug('Debug (tap):', value);
  }

  /** Returns a function suitable for Result.tapErr to log the Err value using console.debug. */
  static debugTapErr<E>(): (error: E) => void {
    return (error: E) => console.debug('Debug (tapErr):', error);
  }
}
