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

// All errors must be handled, as we can't stop execution of the script.
// Main problems:
// - In Nashorn, we can't get proper stack traces
// - The exact function and line of code that threw an error is unknown (unless we look into non-minified JS)
// - In Nashorn, we log the code line, where log.error() is called, not the line, where the error is thrown
// - Impossible to explain to the client part what went wrong
// - Can't fix the error, must roll back to previous state

function fetchAndUpdateUser(): RepoNode<User> {
  const data = fetchCurrentUser(false);
  console.log(`1. User Fetched: ${data}`);

  const parsedData = parseData<User>(data);
  console.log(`2. Data Parsed: ${parsedData}`);

  const node = modifyNode(VALID_ID, parsedData);
  console.log(`3. Node Modified: ${JSON.stringify(node)}`);

  return node;
}

function main(): void {
  try {
    fetchAndUpdateUser();
    console.log('Done.');
  } catch (err) {
    console.error(`Error was thrown somewhere: ${err}`);
  }
}

main();
