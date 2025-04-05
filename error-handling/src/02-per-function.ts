import {
  fetchCurrentUser,
  modifyNode,
  parseData,
  RepoNode,
  VALID_ID,
} from './app';

type User = {
  name: string;
  age: number;
};

// We assume that imported functions in our examples are black boxes
// Error is thrown, not returned, so we need to log them
// Code becomes bloated, and it's not clear what actions led to the error
// To know the exact code that threw an error, we need to look at the logs

function safeFetchCurrentUser(ok = true, valid = true): string | undefined {
  try {
    return fetchCurrentUser(ok, valid);
  } catch (err) {
    console.error(`Error in 'fetchCurrentUser()': ${err}`);
  }
}

function safeParseData(data: string): User | undefined {
  try {
    return parseData<User>(data);
  } catch (err) {
    console.error(`Error in 'parseData()': ${err}`);
  }
}

function safeModifyNode(id: string, data: User): RepoNode<User> | undefined {
  try {
    return modifyNode(id, data);
  } catch (err) {
    console.error(`Error in 'modifyNode()': ${err}`);
  }
}

function fetchAndUpdateUser(): RepoNode<User> | undefined {
  const data = safeFetchCurrentUser(true, false);
  if (!data) {
    return undefined;
  }

  console.log(`1. User Fetched: ${data}`);

  const parsedData = safeParseData(data);
  if (!parsedData) {
    return undefined;
  }

  console.log(`2. Data Parsed: ${parsedData}`);

  const node = safeModifyNode(VALID_ID, parsedData);
  if (!node) {
    return undefined;
  }

  console.log(`3. Node Modified: ${JSON.stringify(node)}`);

  return node;
}

function run(): void {
  const result = fetchAndUpdateUser();
  console.log(`Done: ${result ? 'Success' : 'Failure'}`);
}

run();
