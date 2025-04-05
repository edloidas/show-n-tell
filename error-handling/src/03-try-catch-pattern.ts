import {
  fetchCurrentUser,
  modifyNode,
  parseData,
  RepoNode,
  VALID_ID,
} from './app';
import { ERRORS } from './utils/error';
import { tryCatch } from './utils/go';

type User = {
  name: string;
  age: number;
};

// That's better, but still not ideal
// Assume that tryCatch wrappers will go directly into the code of unsafe functions or remain one-liners
// It's obvious, that we can just return the result, and not construct a new tuple
// It'll be better to chain calls, whenever possible

function safeFetchCurrentUser(): Try<string> {
  return tryCatch(() => fetchCurrentUser(true, false), ERRORS.REST_FETCH_ERROR);
}

function safeParseData(data: string): Try<User> {
  return tryCatch(() => parseData<User>(data), ERRORS.FUNC_PARSE_ERROR);
}

function safeModifyNode(id: string, data: User): Try<RepoNode<User>> {
  return tryCatch(() => modifyNode(id, data), ERRORS.REPO_NODE_NOT_FOUND);
}

function fetchAndUpdateUser(): Try<RepoNode<User>> {
  const [json, err1] = safeFetchCurrentUser();
  if (err1) {
    return [null, err1];
  }

  console.log(`1. User Fetched: ${json}`);

  const [parsedData, err2] = safeParseData(json);
  if (err2) {
    return [null, err2];
  }

  console.log(`2. Data Parsed: ${parsedData}`);

  const [node, err3] = safeModifyNode(VALID_ID, parsedData);
  if (err3) {
    return [null, err3];
  }

  console.log(`3. Node Modified: ${JSON.stringify(node)}`);

  return [node, null];
}

function run(): void {
  const [result, err] = fetchAndUpdateUser();
  if (err) {
    // Here error can be checked by code and localized, add colors, etc.
    console.error(err.toString());
    console.log('\n  -- or log the full stack trace --\n');
    console.error(err);
  }
  console.log(`Done: ${result ? 'Success' : 'Failure'}`);
}

run();
