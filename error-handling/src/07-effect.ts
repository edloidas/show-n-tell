import { Effect, pipe, Data, Match } from 'effect';
import {
  fetchCurrentUser,
  modifyNode,
  parseData,
  RepoNode,
  User,
  VALID_ID,
} from './app';

/*
+ Typed errors are part of the Effect signature Effect<Success, Error, Requirements>
+ Built-in pipe and operators (flatMap, map, tap, catchTag, etc.)
+ Generator syntax (Effect.gen) - reads like async/await
+ Tagged errors - pattern matching on error types
+ Comprehensive error handling with Match
+ Automatic short-circuiting on errors
+ Composable and testable
- Steeper learning curve
- Requires understanding of Effect's runtime model
*/

// * Tagged Error Classes
// Effect provides Data.TaggedError for structured, type-safe errors

class RestFetchError extends Data.TaggedError('RestFetchError')<{
  readonly code: 100;
  readonly message: string;
}> {}

class ParseError extends Data.TaggedError('ParseError')<{
  readonly code: 200;
  readonly message: string;
  readonly cause?: unknown;
}> {}

class RepoNodeNotFoundError extends Data.TaggedError('RepoNodeNotFoundError')<{
  readonly code: 300;
  readonly message: string;
}> {}

type AppError = RestFetchError | ParseError | RepoNodeNotFoundError;

// * Safe wrapper functions using Effect.try

function safeFetchCurrentUser(): Effect.Effect<string, RestFetchError> {
  return Effect.try({
    try: () => fetchCurrentUser(true, false),
    catch: () =>
      new RestFetchError({ code: 100, message: 'User was not fetched.' }),
  }).pipe(Effect.tap((json) => Effect.log(`1. User Fetched: ${json}`)));
}

function safeParseData(data: string): Effect.Effect<User, ParseError> {
  return Effect.try({
    try: () => parseData<User>(data),
    catch: (e) =>
      new ParseError({
        code: 200,
        message: 'Invalid JSON input.',
        cause: e,
      }),
  }).pipe(
    Effect.tap((user) => Effect.log(`2. Data Parsed: ${JSON.stringify(user)}`))
  );
}

function safeModifyNode(
  id: string,
  data: User
): Effect.Effect<RepoNode<User>, RepoNodeNotFoundError> {
  return Effect.try({
    try: () => modifyNode(id, data),
    catch: () =>
      new RepoNodeNotFoundError({ code: 300, message: 'Node was not found.' }),
  }).pipe(
    Effect.tap((node) =>
      Effect.log(`3. Node Modified: ${JSON.stringify(node)}`)
    )
  );
}

// * Pipeline approach - using pipe and flatMap

function fetchAndUpdateUserPipe(): Effect.Effect<RepoNode<User>, AppError> {
  return pipe(
    safeFetchCurrentUser(),
    Effect.flatMap(safeParseData),
    Effect.flatMap((user) => safeModifyNode(VALID_ID, user)),
    Effect.tap(() => Effect.log('Clean up finally-like logic here.'))
  );
}

// * Generator approach - reads like async/await

function fetchAndUpdateUserGen(): Effect.Effect<RepoNode<User>, AppError> {
  return Effect.gen(function* () {
    const json = yield* safeFetchCurrentUser();
    const user = yield* safeParseData(json);
    const node = yield* safeModifyNode(VALID_ID, user);
    yield* Effect.log('Clean up finally-like logic here.');
    return node;
  });
}

// * Error handling with pattern matching

function handleError(error: AppError): void {
  pipe(
    Match.value(error),
    Match.tag('RestFetchError', (e) =>
      console.error(`[${e.code}] REST Error: ${e.message}`)
    ),
    Match.tag('ParseError', (e) =>
      console.error(`[${e.code}] Parse Error: ${e.message}`, e.cause)
    ),
    Match.tag('RepoNodeNotFoundError', (e) =>
      console.error(`[${e.code}] Repo Error: ${e.message}`)
    ),
    Match.exhaustive
  );
}

// * Main function demonstrating both approaches

function main(): void {
  console.log('=== Pipeline Approach ===\n');

  Effect.runSync(
    fetchAndUpdateUserPipe().pipe(
      Effect.match({
        onSuccess: () => console.log('\nDone (pipe).'),
        onFailure: handleError,
      })
    )
  );

  console.log('\n=== Generator Approach ===\n');

  Effect.runSync(
    fetchAndUpdateUserGen().pipe(
      Effect.match({
        onSuccess: () => console.log('\nDone (gen).'),
        onFailure: handleError,
      })
    )
  );
}

main();
