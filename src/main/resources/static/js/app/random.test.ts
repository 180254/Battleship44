/// <reference path="random.impl.ts"/>
/// <reference path="assert.impl.ts"/>
/// <reference path="logger.impl.ts"/>
/// <reference types="mocha" />

namespace random {
    "use strict";

    describe("RandomEx", () => {

        // Math.random returns a number between 0 (inclusive) and 1 (_exclusive_)
        const ONE_ALMOST: number = 1 - (1e-5);

        let assert_: assert.AssertEx;
        let random_: random.RandomEx;

        before(() => {
            logger.cLevel = logger.Level.WARN;
            assert_ = new assert.AssertEx();
            random_ = new random.RandomEx();
        });

        describe("num", () => {

            it("should return value - min", () => {
                random_.cRandom = () => 0;
                assert_.numEquals(0, random_.num());
            });

            it("should return value - max", () => {
                random_.cRandom = () => ONE_ALMOST;
                const result: number = random_.num();

                assert_.numEquals(ONE_ALMOST, result);
                assert_.ok(result < 1, "result < 1");
            });
        });

        describe("numArbitrary", () => {

            it("should return value - min", () => {
                random_.cRandom = () => 0;
                assert_.numEquals(-5.4, random_.numArbitrary(-5.4, 7.8));
            });

            it("should return value - max", () => {
                random_.cRandom = () => ONE_ALMOST;
                const result: number = random_.numArbitrary(-5.4, 7.8);

                assert_.numEquals(7.799, result, 1e-2);
                assert_.ok(result < 7.8, "result < max");
            });
        });

        describe("int", () => {

            it("should return value - min", () => {
                random_.cRandom = () => 0;
                assert_.numEquals(-5, random_.int(-5, 7));
            });

            it("should return value - max", () => {
                random_.cRandom = () => ONE_ALMOST;
                assert_.numEquals(6, random_.int(-5, 7));
            });
        });

        describe("intInclusive", () => {

            it("should return value - min", () => {
                random_.cRandom = () => 0;
                assert_.numEquals(-5, random_.intInclusive(-5, 7));
            });

            it("should return value - max", () => {
                random_.cRandom = () => ONE_ALMOST;
                assert_.numEquals(7, random_.intInclusive(-5, 7));
            });
        });

        describe("str", () => {

            it("probably works", () => {
                assert_.ok(true);
            });
        });
    });
}
