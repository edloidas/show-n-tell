// function ok<T>(data: T): OkResult<T> {
//   return { ok: true, data };
// }

// function err<E extends CustomAppError>(err: E): ErrorResult<E> {
//   return { ok: false, err };
// }

// type OkResult<T> = {
//   readonly ok: true;
//   readonly data: T;
// };

// type ErrorResult<E> = {
//   readonly ok: false;
//   readonly err: E;
// };

// type Result<T, E extends AppError = AppError> = OkResult<T> | ErrorResult<E>;

// function tryCatch<T, E extends AppError = AppError>(
//   fn: () => T,
//   err: E
// ): Result<T, E> {
//   try {
//     return { ok: true, data: fn() };
//   } catch (e) {
//     return { ok: false, err };
//   }
// }

// // This function is basic example of what should be wrapped into tryCatch
// function parse(): Result<Record<string, unknown>, AppError> {
//   return tryCatch(() => JSON.parse('dsdasdsa'), ERROR.ERR1);
// }

// // This function is the example of usage of
// function usageExample(): Result<Record<string, unknown>> {
//   const r = parse();
//   if (!r.ok) {
//     console.error(r.err.message);
//     return r;
//   }

//   console.log(r.data);

//   return r;
// }
