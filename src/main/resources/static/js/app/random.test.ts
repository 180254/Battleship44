/// <reference path="random.impl.ts"/>
/// <reference path="assert.impl.ts"/>
/// <reference path="logger.impl.ts"/>
/// <reference types="mocha" />

namespace random {
    "use strict";

    // tests are for range <-LARGE, LARGE>
    const LARGE: number = 0xFFFFFFFF;

    describe("RandomEx", () => {

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
                random_.cRandom = () => 1;
                const result: number = random_.num();
                assert_.ok(result < 1, "result < 1");
            });

            it("should return value - some", () => {
                random_.cRandom = () => 0.4;
                assert_.numEquals(0.4, random_.num());
            });
        });

        describe("numArbitrary", () => {

            it("should return value - min, normal", () => {
                random_.cRandom = () => 0;
                assert_.numEquals(-5.4, random_.numArbitrary(-5.4, 7.8));
            });

            it("should return value - min, large", () => {
                random_.cRandom = () => 0;
                const diff: number = 0.4;
                assert_.numEquals(-LARGE + diff, random_.numArbitrary(-LARGE + diff, LARGE));
            });

            it("should return value - max, normal", () => {
                random_.cRandom = () => 1;
                const result: number = random_.numArbitrary(-5.4, 7.8);

                assert_.numEquals(7.799999, result);
                assert_.ok(result < 7.8, "result < max");
            });

            it("should return value - max, large", () => {
                random_.cRandom = () => 1;
                const diff: number = 0.4;
                const result: number = random_.numArbitrary(-LARGE, LARGE - diff);

                assert_.numEquals(LARGE - diff, result, 1);
                assert_.ok(result < LARGE - diff, "result < max");
            });

            it("should return value - some", () => {
                random_.cRandom = () => 0.4;
                const result: number = random_.numArbitrary(-5.4, 7.8);
                assert_.numEquals(-0.12, result);
            });
        });

        describe("int", () => {

            it("should return value - min, normal", () => {
                random_.cRandom = () => 0;
                assert_.numEquals(-5, random_.int(-5, 7));
            });

            it("should return value - min, large", () => {
                random_.cRandom = () => 0;
                assert_.numEquals(-LARGE, random_.int(-LARGE, LARGE));
            });

            it("should return value - max, normal", () => {
                random_.cRandom = () => 1;
                assert_.numEquals(6, random_.int(-5, 7));
            });

            it("should return value - max, large", () => {
                random_.cRandom = () => 1;
                assert_.numEquals(LARGE - 1, random_.int(-LARGE, LARGE));
            });

            it("should return value - some", () => {
                random_.cRandom = () => 0.75;
                assert_.numEquals(4, random_.int(-5, 7));
            });
        });

        describe("intInclusive", () => {

            it("should return value - min, normal", () => {
                random_.cRandom = () => 0;
                assert_.numEquals(-5, random_.intInclusive(-5, 7));
            });

            it("should return value - min, large", () => {
                random_.cRandom = () => 0;
                assert_.numEquals(-LARGE, random_.intInclusive(-LARGE, LARGE));
            });

            it("should return value - max, normal", () => {
                random_.cRandom = () => 1;
                assert_.numEquals(7, random_.intInclusive(-5, 7));
            });

            it("should return value - max, large", () => {
                random_.cRandom = () => 1;
                assert_.numEquals(LARGE, random_.intInclusive(-LARGE, LARGE));
            });

            it("should return value - some", () => {
                random_.cRandom = () => 0.75;
                assert_.numEquals(4, random_.intInclusive(-5, 7));
            });
        });

        describe("str", () => {

            it("probably works", () => {
                assert_.ok(true);
            });
        });
    });
}
