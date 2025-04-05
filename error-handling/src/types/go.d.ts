// To imitate Go returns we'll use tuples
// In Go, even if an error occurs, the function still returns a value
// If there’s a failure, that value is typically the type’s zero value
// In our case, we'll use null for the zero value

type Either<T, E> = readonly [T, null] | readonly [null, E];

type Try<T> = Either<T, Error>;
