/// <reference path="assert.impl.ts"/>
/// <reference path="logger.impl.ts"/>
/// <reference path="format.impl.ts"/>
/// <reference types="mocha" />

namespace format {
    "use strict";

    describe("String", () => {

        let assert_: assert.AssertEx;

        before(() => {
            assert_ = new assert.AssertEx();
            logger.cLevel = logger.Level.WARN;
        });

        describe("format", () => {

            it("should accept param with type - string", () => {
                assert_.equals(
                    "/a/",
                    "/{0}/".format("a")
                );
            });

            it("should accept param with type - number", () => {
                assert_.equals(
                    "/48/",
                    "/{0}/".format(48)
                );
            });

            it("should accept param with type - null", () => {
                assert_.equals(
                    "/null/",
                    "/{0}/".format(null)
                );
            });

            it("should accept param with type - undefined", () => {
                assert_.equals(
                    "/undefined/",
                    "/{0}/".format(undefined)
                );
            });

            it("should accept param with type - mixed", () => {
                assert_.equals(
                    "/1-5-RR/",
                    "/{0}-{1}-{2}/".format(1, 5, "RR")
                );
            });

            it("should not fail on missing params - none provided", () => {
                assert_.equals(
                    "/{0}-{1}-{2}/",
                    "/{0}-{1}-{2}/".format()
                );
            });

            it("should not fail on missing params - some provided", () => {
                assert_.equals(
                    "/1-5-{2}/",
                    "/{0}-{1}-{2}/".format(1, 5)
                );
            });

            it("should not follow reference change - example1", () => {
                assert_.equals(
                    "/{1}-5-{2}/",
                    "/{0}-{1}-{2}/".format("{1}", 5)
                );
            });

            it("should not follow reference change - example2", () => {
                assert_.equals(
                    "/{2}-{1}-5/",
                    "/{0}-{1}-{2}/".format("{2}", "{1}", 5)
                );
            });

            it("should not fail on missing reference - none found", () => {
                assert_.equals(
                    "/a-b-c/",
                    "/a-b-c/".format("x", "y", 5)
                );
            });

            it("should not fail on missing reference - some found", () => {
                assert_.equals(
                    "/y-b-c/",
                    "/{1}-b-c/".format("x", "y", 5)
                );
            });

            it("should fill - multiple references", () => {
                assert_.equals(
                    "/x-x-y/",
                    "/{0}-{0}-{1}/".format("x", "y")
                );
            });

            it("should fill - references not sorted", () => {
                assert_.equals(
                    "/z-x-c-y/",
                    "/{2}-{0}-{3}-{1}/".format("x", "y", "z", "c")
                );
            });
        });
    });
}
