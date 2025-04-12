import assert from 'assert';

const multiplyBy2 = (x: number): number => x * 2;
const isGreaterThan4 = (x: number): boolean => x > 4;

(function listMonad(): void {
  // Value
  const a = 5;
  // Wrapper
  const unit = (value: number): number[] => [value];
  // Monad
  const monad = unit(a);

  // Functions
  const f = (x: number): number[] => unit(multiplyBy2(x));
  const g = (x: number): boolean => isGreaterThan4(x);

  // * 1. Left identity: unit(a).flatMap(f) === f(a)

  const leftIdentity1 = unit(a).flatMap(f);
  const leftIdentity2 = f(a);

  assert.deepStrictEqual(
    leftIdentity1,
    leftIdentity2,
    `Left identity failed: ${leftIdentity1} !== ${leftIdentity2}`
  );
  console.log(`Left identity: ${leftIdentity1} === ${leftIdentity2}`);

  // * 2. Right identity: m.flatMap(unit) === m

  const rightIdentity1 = monad.flatMap(unit);
  const rightIdentity2 = monad;

  assert.deepStrictEqual(
    rightIdentity1,
    rightIdentity2,
    `Right identity failed: ${rightIdentity1} !== ${rightIdentity2}`
  );
  console.log(`Right identity: ${rightIdentity1} === ${rightIdentity2}`);

  // * 3. Associativity: m.flatMap(f).flatMap(g) === m.flatMap(x => f(x).flatMap(g))

  const associativity1 = monad.flatMap(f).flatMap(g);
  const associativity2 = monad.flatMap((x) => f(x).flatMap(g));

  assert.deepStrictEqual(
    associativity1,
    associativity2,
    `Associativity failed: ${associativity1} !== ${associativity2}`
  );
  console.log(`Associativity: ${associativity1} === ${associativity2}`);
})();
