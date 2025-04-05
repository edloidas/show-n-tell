import { CustomAppError } from './error';

export function tryCatch<T, E extends CustomAppError>(
  fn: () => T,
  err: E
): Try<T> {
  try {
    return [fn(), null];
  } catch (e) {
    return [null, err.withMsg(String(e))];
  }
}
