export type Result<T, E = Error> = Success<T> | Failure<E>;

export class Success<T> {
  readonly isSuccess = true as const;
  readonly isFailure = false as const;
  constructor(readonly value: T) {}
}

export class Failure<E> {
  readonly isSuccess = false as const;
  readonly isFailure = true as const;
  constructor(readonly error: E) {}
}

export const ok = <T>(value: T): Result<T, never> => new Success(value);
export const fail = <E>(error: E): Result<never, E> => new Failure(error);
