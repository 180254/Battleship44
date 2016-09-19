declare namespace assert {

    interface Assert {

        ok(condition: boolean, message?: string): void;

        not(condition: boolean, message?: string): void;

        equals(expected: any, actual: any): void;

        notEquals(expected: any, actual: any): void;

        numEquals(expected: number, actual: number, epsilon: number): void;

        strContains(haystack: string, needle: any): void;
    }
}
