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

// The most basic flow in our code:
//   1. Fetch data (e.g. via http-lib or Java bean)
//   2. Process the result in our code
//   3. Write the result to repo
// Can be seen on server parts, and on clients where we process requests and data.

function fetchAndUpdateUser(): RepoNode<User> {
  const data = fetchCurrentUser();
  console.log(`1. User Fetched: ${data}`);

  const parsedData = parseData<User>(data);
  console.log(`2. Data Parsed: ${parsedData}`);

  const node = modifyNode(VALID_ID, parsedData);
  console.log(`3. Node Modified: ${JSON.stringify(node)}`);

  return node;
}

function main(): void {
  fetchAndUpdateUser();
  console.log('Done.');
}

main();
