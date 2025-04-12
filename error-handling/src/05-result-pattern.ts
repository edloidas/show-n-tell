import {
  fetchCurrentUser,
  modifyNode,
  parseData,
  RepoNode,
  VALID_ID,
} from './app';
import { ERRORS } from './utils/error';
import { Result } from './utils/rust';
type User = {
  name: string;
  age: number;
};

// + Function calls can now be chained together
// + No more "try-fail", but "try-catch-fix"
// +- Less functional approach
// Reads better on 80 max line length

function safeFetchCurrentUser(): Result<string, Error> {
  return Result.tryCatch(
    () => fetchCurrentUser(true, false),
    () => ERRORS.REST_FETCH_ERROR
  );
}

function safeParseData(data: string): Result<User, Error> {
  return Result.tryCatch(
    () => parseData<User>(data),
    (e) => ERRORS.FUNC_PARSE_ERROR.withMsg(String(e))
  );
}

function safeModifyNode(id: string, data: User): Result<RepoNode<User>, Error> {
  return Result.tryCatch(
    () => modifyNode(id, data),
    () => ERRORS.REPO_NODE_NOT_FOUND
  );
}

function fetchAndUpdateUser(): Result<RepoNode<User>, Error> {
  return safeFetchCurrentUser()
    .chain((data) => safeParseData(data))
    .chain((user) => safeModifyNode(VALID_ID, user));
}

function main(): void {
  const result = fetchAndUpdateUser();

  if (result.isErr()) {
    console.error(result);
  } else {
    console.log('Done.');
  }
}

main();
