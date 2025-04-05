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

// The most basic flow in our server code:
//   1. Fetch data (e.g. via http-lib or Java bean)
//   2. Process the result in our code
//   3. Write the result to repo

function fetchAndUpdateUser(): RepoNode<User> {
  const data = fetchCurrentUser();
  console.log(`1. User Fetched: ${data}`);

  const parsedData = parseData<User>(data);
  console.log(`2. Data Parsed: ${parsedData}`);

  const node = modifyNode(VALID_ID, parsedData);
  console.log(`3. Node Modified: ${JSON.stringify(node)}`);

  return node;
}

function run(): void {
  fetchAndUpdateUser();
  console.log('Done');
}

run();
