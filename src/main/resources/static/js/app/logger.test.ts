/// <reference path="assert.impl.ts"/>
/// <reference path="logger.impl.ts"/>
/// <reference types="mocha" />

namespace logger {
    "use strict";

    class TestClass {
        public test: string = "123";
    }

    describe("LoggerEx", () => {

        let assert_: assert.AssertEx;
        let logger_: logger.LoggerEx;
        let output: string;

        before(() => {
            assert_ = new assert.AssertEx();
            logger_ = new logger.LoggerEx(TestClass);
            logger_.cOutput = (str) => output += str + "\n";
        });

        beforeEach(() => {
            logger.LoggerEx.cLevel = Level.TRACE;
            output = "";
        });

        describe("debug", () => {

            it("should provide in output - level", () => {
                logger_.debug("xyz");
                assert_.strContains(output, "debug");
            });

            it("should provide in output - marked level for >=warn", () => {
                logger_.warn("xyz");
                assert_.strContains(output, "%%%___warn___%%%");
            });

            it("should not provide in output - marked level for <warn", () => {
                logger_.info("xyz");
                assert_.strContains(output, "%%%___");
            });

            it("should provide in output - given text", () => {
                logger_.debug("xyz");
                assert_.strContains(output, "xyz");
            });

            it("should provide in output - given parametrized text", () => {
                logger_.debug("xy{0}z", 19);
                assert_.strContains(output, "xy19z");
            });

            it("should provide in output - owner name", () => {
                logger_.debug("xyz");
                assert_.strContains(output, "TestClass");
            });

            it("should provide in output - caller name, function", () => {
                logger_.debug("xyz");
                assert_.strContains(output, "it");
            });

            it("should provide in output - caller name, method", () => {
                class Test {
                    public sth(): void {
                        logger_.debug("xyz");
                    }
                }

                new Test().sth();
                assert_.strContains(output, "sth");
            });

            it("should provide in output - caller name, static method", () => {
                class Test {
                    public test: string = "123";

                    public static Sth(): void {
                        logger_.debug("xyz");
                    }
                }

                Test.Sth();
                assert_.strContains(output, "Sth");
            });

            it("should log - current level is lower", () => {
                logger.LoggerEx.cLevel = Level.TRACE;
                logger_.debug("xyz");
                assert_.notEquals("", output);
            });

            it("should log - current level is same", () => {
                logger.LoggerEx.cLevel = Level.DEBUG;
                logger_.debug("xyz");
                assert_.notEquals("", output);
            });

            it("should not log - current level is higher", () => {
                logger.LoggerEx.cLevel = Level.INFO;
                logger_.debug("xyz");
                assert_.equals("", output);
            });
        });
    });
}
