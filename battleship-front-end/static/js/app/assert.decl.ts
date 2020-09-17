export interface Assert {
  ok(condition: boolean, message?: string): void;

  not(condition: boolean, message?: string): void;

  equals<T>(expected: T, actual: T): void;

  notEquals<T>(expected: T, actual: T): void;

  numEquals(expected: number, actual: number, epsilon: number): void;

  strContains(haystack: string, needle: string): void;

  strNotContains(haystack: string, needle: string): void;
}
