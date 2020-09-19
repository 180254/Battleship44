export class Assert {
  public ok(condition: boolean, message?: string): void {
    if (!condition) {
      throw new Error('(ok) condition failed (message: {0})'.format(message));
    }
  }

  public not(condition: boolean, message?: string): void {
    if (condition) {
      throw new Error('(not) condition failed (message: {0})'.format(message));
    }
  }

  public equals<T>(expected: T, actual: T): void {
    if (expected !== actual) {
      throw new Error('expected: {0}, actual: {1}'.format(expected, actual));
    }
  }

  public notEquals<T>(expected: T, actual: T): void {
    if (expected === actual) {
      throw new Error(
        'expected not: {0}, actual: {1}'.format(expected, actual)
      );
    }
  }

  public numEquals(expected: number, actual: number, epsilon = 1e-5): void {
    if (Math.abs(expected - actual) > epsilon) {
      throw new Error(
        'expected: {0}, actual: {1}, epsilon: {2}'.format(
          expected,
          actual,
          epsilon
        )
      );
    }
  }

  public strContains(haystack: string, needle: string): void {
    if (!haystack.includes(needle)) {
      throw new Error('expected: {0} to contain: {1}'.format(haystack, needle));
    }
  }

  public strNotContains(haystack: string, needle: string): void {
    if (haystack.includes(needle)) {
      throw new Error(
        'expected: {0} to not contain: {1}'.format(haystack, needle)
      );
    }
  }
}
