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

// All errors must be handled, as we can't stop execution of the script
// In Nashorn, we can't get proper stack traces
// We can't get the exact line of code that threw an error

function fetchAndUpdateUser(): RepoNode<User> {
  const data = fetchCurrentUser(false);
  console.log(`1. User Fetched: ${data}`);

  const parsedData = parseData<User>(data);
  console.log(`2. Data Parsed: ${parsedData}`);

  const node = modifyNode(VALID_ID, parsedData);
  console.log(`3. Node Modified: ${JSON.stringify(node)}`);

  return node;
}

function run(): void {
  try {
    fetchAndUpdateUser();
    console.log('Done');
  } catch (err) {
    console.error(`Error was thrown somewhere: ${err}`);
  }
}

run();
