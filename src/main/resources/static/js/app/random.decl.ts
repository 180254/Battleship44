namespace random {
    "use strict";

    export interface Random {
        // Returns a random number between 0 (inclusive) and 1 (exclusive)
        num(): number;

        // Returns a random number between min (inclusive) and max (exclusive)
        numArbitrary(min: number, max: number): number;

        // Returns a random integer between min (included) and max (excluded)
        // Using Math.round() will give you a non-uniform distribution!
        int(min: number, max: number): number;

        // Returns a random integer between min (included) and max (included)
        // Using Math.round() will give you a non-uniform distribution!
        intInclusive(min: number, max: number): number;

        // possible chars: aA#!
        str(length: number, chars: string): string;
    }
}
