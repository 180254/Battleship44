/// <reference path="url.impl.ts"/>
/// <reference path="assert.impl.ts"/>
/// <reference path="logger.impl.ts"/>
/// <reference path="format.impl.ts"/>
/// <reference types="mocha" />

// tslint:disable:no-http-string
namespace url {
    "use strict";

    describe("UrlEx", () => {

        let assert_: assert.AssertEx;
        let url_: url.UrlEx;

        before(() => {
            logger.cLevel = logger.Level.WARN;
            assert_ = new assert.AssertEx();
            url_ = new url.UrlEx();
        });

        describe("param", () => {

            const verifyParamMethod: ((loc: string, name: string, expValue: string | null) => void) =
                (loc, name, expValue) => {
                    url_.cLocationHref = () => loc;
                    const result: string | null = url_.param(name);
                    assert_.equals(expValue, result);
                };

            it("should extract param - one provided", () => {
                verifyParamMethod(
                    "http://none.com/?a=a123b",
                    "a", "a123b"
                );
            });

            it("should extract param - several provided, first needed", () => {
                verifyParamMethod(
                    "http://none.com/?a=a123b&b=1&a123b=c&c=sdf&d=dfd",
                    "a", "a123b"
                );
            });

            it("should extract param - several provided, one needed", () => {
                verifyParamMethod(
                    "http://none.com/?a=a123b&b=1&a123b=c&c=sdf&d=dfd",
                    "a123b", "c"
                );
            });

            it("should extract param - several provided, last needed", () => {
                verifyParamMethod(
                    "http://none.com/?a=a123b&b=1&a123b=c&c=sdf&d=dfd",
                    "d", "dfd"
                );
            });

            it("should extract param - name is part of another name", () => {
                verifyParamMethod(
                    "http://none.com/?aaaa=123&aa=567&a=8",
                    "aa", "567"
                );
            });

            it("should extract param - name&value must be decoded", () => {
                verifyParamMethod(
                    "http://none.com/?%5Ekey%25%23=%26value%3D&b=1",
                    "^key%#", "&value="
                );
            });

            it("should extract param - value is empty, equals mark provided", () => {
                verifyParamMethod(
                    "http://none.com/?aa&bb=&cc=1",
                    "bb", ""
                );
            });

            it("should extract param - value is empty, equals mark not provided", () => {
                verifyParamMethod(
                    "http://none.com/?aa&bb&cc=1",
                    "bb", ""
                );
            });

            it("should not extract param - as not provided (simple)", () => {
                verifyParamMethod(
                    "http://none.com/?a=a123b&b=1&a123b=c&c=sdf&d=dfd",
                    "1234", null
                );
            });

            it("should not extract param - as not provided, but such value exist", () => {
                verifyParamMethod(
                    "http://none.com/?a=a123b&b=1&a123b=c&c=sdf&d=dfd",
                    "sdf", null
                );
            });
        });

        // -----------------------------------------------------------------------------------------------------------

        describe("url", () => {

            const verifyUrlMethod: ((origin: string, params: UrlParam[], expected: string) => void) =
                (origin, params, expected) => {
                    url_.cLocationOrigin = () => origin;
                    const result: string = url_.url(...params);
                    assert_.equals(expected, result);
                };

            it("should accept no params", () => {
                verifyUrlMethod(
                    "http://none.com",
                    [],
                    "http://none.com",
                );
            });

            it("should add - one full param", () => {
                verifyUrlMethod(
                    "http://none.com",
                    [
                        new UrlParamEx("key", "value"),
                    ],
                    "http://none.com/?key=value",
                );
            });

            it("should add - more than one full param", () => {
                verifyUrlMethod(
                    "http://none.com",
                    [
                        new UrlParamEx("key1", "value1"),
                        new UrlParamEx("key2", "value2"),
                        new UrlParamEx("key3", "value3"),
                    ],
                    "http://none.com/?key1=value1&key2=value2&key3=value3",
                );
            });

            it("should add - one name-only param", () => {
                verifyUrlMethod(
                    "http://none.com",
                    [
                        new UrlParamEx("key"),
                    ],
                    "http://none.com/?key",
                );
            });

            it("should add - more than one name-only param", () => {
                verifyUrlMethod(
                    "http://none.com",
                    [
                        new UrlParamEx("key1"),
                        new UrlParamEx("key2"),
                        new UrlParamEx("key3"),
                    ],
                    "http://none.com/?key1&key2&key3",
                );
            });

            it("should add - mixed types of param", () => {
                verifyUrlMethod(
                    "http://none.com",
                    [
                        new UrlParamEx("key1"),
                        new UrlParamEx("key2", "value2"),
                        new UrlParamEx("key3"),
                    ],
                    "http://none.com/?key1&key2=value2&key3",
                );
            });

            it("should add - key&value need be encoded", () => {
                verifyUrlMethod(
                    "http://none.com",
                    [
                        new UrlParamEx("^key%#", "&value="),
                    ],
                    "http://none.com/?%5Ekey%25%23=%26value%3D",
                );
            });
        });
    });
}
