export type User = {
  name: string;
  age: number;
};

export type RepoNode<T extends Record<string, unknown> = {}> = T & {
  _id: string;
};

// ID for operation on repo's nodes
export const VALID_ID = 'valid-id-123';
export const INVALID_ID = 'invalid-id-abc';

// JSON for parsing
export const VALID_JSON = '{"name": "John", "age": 30}';
export const INVALID_JSON = 'name: John';

//
// * 1. Fetch data
// May fail on http response, timeout, etc.
//
export function fetchCurrentUser(ok = true, valid = true): string {
  if (!ok) {
    throw new Error('Failed to fetch data');
  }
  return valid ? VALID_JSON : INVALID_JSON;
}

//
// * 2. Parse data
// LLM may return non-parsable result
//
export function parseData<T extends Record<string, unknown>>(input: string): T {
  return JSON.parse(input) as T;
}

//
// * 3. Repo operations
// May fail on timeout, node no longer exist, etc.
//
export function modifyNode<T extends Record<string, unknown>>(
  id: string,
  data: T
): RepoNode<T> {
  if (id !== VALID_ID) {
    throw new Error('Node not found');
  }

  return {
    _id: id,
    ...data,
  };
}
