import {
  fetchCurrentUser,
  modifyNode,
  parseData,
  RepoNode,
  VALID_ID,
} from './app';
import { Console } from './utils/console';
import { ERRORS } from './utils/error';
import { pipe } from './utils/pipe';
import { Result } from './utils/rust';

/*
Reads better on 80 max line length
+ We can chain calls
+ We can pipe operations that return Result
+ In case of error, we can return custom error or do proper handling
- Introduces lots of new syntax for people new to functional programming
- Still missing currying, so we can't do `pipe(safeFetchCurrentUser, safeParseData, safeModifyNode(VALID_ID))`
*/

type User = {
  name: string;
  age: number;
};

function safeFetchCurrentUser(): Result<string, AppError> {
  return Result.try(
    () => fetchCurrentUser(true, false),
    ERRORS.REST_FETCH_ERROR
  ).tap((json) => console.log(`1. User Fetched: ${json}`));
}

function safeParseData(data: string): Result<User, AppError> {
  return Result.tryCatch<User, AppError>(
    () => parseData<User>(data),
    (e) => ERRORS.FUNC_PARSE_ERROR.withMsg(String(e))
  ).tap((data) => console.log(`2. Data Parsed: ${data}`));
}

function safeModifyNode(
  id: string,
  data: User
): Result<RepoNode<User>, AppError> {
  return Result.try(() => modifyNode(id, data), ERRORS.REPO_NODE_NOT_FOUND).tap(
    (node) => console.log(`3. Node Modified: ${node}`)
  );
}

function fetchAndUpdateUser(): Result<RepoNode<User>, AppError> {
  // Can also call pipe directly on the Result object `safeFetchCurrentUser().pipe(...)`
  // Or `pipe(Result.ok(undefined), safeFetchCurrentUser, ...)`
  return pipe(safeFetchCurrentUser(), safeParseData, (user) =>
    safeModifyNode(VALID_ID, user)
  );
}

function main(): void {
  fetchAndUpdateUser()
    .tap(() => console.log('Done.'))
    .tapErr(Console.errorTap());
}

main();
