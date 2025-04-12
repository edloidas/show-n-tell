import { Result } from './rust';

/*
It's impossible to implement a type-safe pipe function in TypeScript with unlimited generic parameters.
Solution is define multiple overloaded versions of the pipe function up to N parameters.
We'll define 1, 2 and 3 parameter versions.

It's done in similar way in other libraries:
- Effect.ts: https://github.com/Effect-TS/effect/blob/b70724993ae020ce8ee2822eb5132550836d244a/packages/effect/src/Pipeable.ts#L9
- Ramda: https://github.com/ramda/types/blob/13d36d597c51793627a7b0dc0d83c62f1236029b/types/pipe.d.ts#L32
*/

export function pipe<T, E>(source: Result<T, E>): Result<T, E>;

export function pipe<T, E, A>(
  source: Result<T, E>,
  op1: (value: T) => Result<A, E>
): Result<A, E>;

export function pipe<T, E, A, B>(
  source: Result<T, E>,
  op1: (value: T) => Result<A, E>,
  op2: (value: A) => Result<B, E>
): Result<B, E>;

export function pipe<T, E, A, B, C>(
  source: Result<T, E>,
  op1: (value: T) => Result<A, E>,
  op2: (value: A) => Result<B, E>,
  op3: (value: B) => Result<C, E>
): Result<C, E>;

// Implementation (uses 'any' internally, but type safety is guaranteed by overloads)
export function pipe(
  source: Result<any, any>,
  ...operations: Array<(value: any) => Result<any, any>>
): Result<any, any> {
  let currentResult = source;
  for (const operation of operations) {
    // Use chain's short-circuiting behavior
    currentResult = currentResult.chain(operation);
    // ! Optimization:
    // If we hit an error, we can stop early, though chain already handles this logically.
    // Otherwise, we can just use reduce to chain the operations.
    if (currentResult.isErr()) {
      break;
    }
  }
  return currentResult;
}
