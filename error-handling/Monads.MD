# Monads

A monad is a design pattern that lets us sequence operations while keeping them in a consistent context.

## Simple Explanation:

A monad is like a special box that not only holds a value but also provides a set of operations to transform that value and chain together multiple operations.

It supports two basic operations:

- Wrapping (or `pure` operation): Taking a value and putting it into your monadic context (the box).
- Chaining (or `bind` operation): Passing the value from one computation to the next, making the overall process seamless and error-resistant.

See [Monad Example](./src/04-monad-example.ts) for a practical example.

## Complex Explanation:

A monad can be understood as an abstract data type with at least two fundamental operations:

- `of` / `return` / `pure`:

  This operation takes a plain value and “lifts” it into the monadic context. It provides a uniform way to inject values into the computation chain.

- `bind` / `chain`:

  It takes a monadic value and a function that returns a monadic value, then “chains” them so that the function operates on the unwrapped value and the result is automatically rewrapped in the same monadic context.

## Key Properties (Monad Laws)

Monads must satisfy three laws that ensure consistent behavior when chaining operations:

- **Left Identity**:
  Wrapping a value with `of` and then chaining it with a function should yield the same result as just applying the function directly:

  ```ts
  of(a).chain(f) === f(a);
  ```

- **Right Identity**:
  Chaining a monadic value with `of` should not change the value:

  ```ts
  m.chain(of) === m;
  ```

- **Associativity**:
  When chaining multiple operations, the order in which the chaining is performed does not matter:

  ```ts
  m.chain(f).chain(g) === m.chain((a) => f(a).chain(g));
  ```

  > Associativity in the context of a monad means that when you combine or chain multiple computations together, the way you group these computations does not change the final result. In other words, if you have three computations and you apply them in sequence, it doesn't matter whether you combine the first two together first and then combine their result with the third, or whether you combine the second and third together first and then combine that with the first—the overall outcome will be the same. This property is essential for reliable and predictable chaining of operations in a monadic structure.

These properties make monads a robust framework for sequencing computations, managing side effects, and handling errors in a predictable manner.
