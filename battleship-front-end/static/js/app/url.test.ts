/// <reference path="url.impl.ts"/>
/// <reference path="assert.impl.ts"/>
/// <reference path="logger.impl.ts"/>
/// <reference path="format.impl.ts"/>
/// <reference path="escape.impl.ts"/>
/// <reference types="mocha" />

namespace url {
    "use strict";

    describe("UrlEx", () => {

        let assert_: assert.AssertEx;
        let url_: url.UrlEx;

        before(() => {
            logger.LoggerEx.cLevel = logger.Level.WARN;
            assert_ = new assert.AssertEx();
            url_ = new url.UrlEx();
        });

        describe("param", () => {

            const verifyParamMethod: ((locHref: string, name: string, expValue: string | undefined) => void) =
                (locHref, name, expValue) => {
                    url_.cLocationHref = () => locHref;
                    const result: UrlParam = url_.param(name);
                    assert_.equals(name, result.name);
                    assert_.equals(expValue, result.value);
                };

            it("should extract param - one provided", () => {
                verifyParamMethod(
                    "http://www.example.com/?a=a123b",
                    "a", "a123b"
                );
            });

            it("should extract param - several provided, first needed", () => {
                verifyParamMethod(
                    "http://www.example.com/?a=a123b&b=1&a123b=c&c=sdf&d=dfd",
                    "a", "a123b"
                );
            });

            it("should extract param - several provided, one needed", () => {
                verifyParamMethod(
                    "http://www.example.com/?a=a123b&b=1&a123b=c&c=sdf&d=dfd",
                    "a123b", "c"
                );
            });

            it("should extract param - several provided, last needed", () => {
                verifyParamMethod(
                    "http://www.example.com/?a=a123b&b=1&a123b=c&c=sdf&d=dfd",
                    "d", "dfd"
                );
            });

            it("should extract param - name is part of another name", () => {
                verifyParamMethod(
                    "http://www.example.com/?aaaa=123&aa=567&a=8",
                    "aa", "567"
                );
            });

            it("should extract param - name&value must be decoded", () => {
                verifyParamMethod(
                    "http://www.example.com/?%5Ekey%25%23=%26value%3D&b=1",
                    "^key%#", "&value="
                );
            });

            it("should extract param - value is empty, equals mark provided", () => {
                verifyParamMethod(
                    "http://www.example.com/?aa&bb=&cc=1",
                    "bb", ""
                );
            });

            it("should extract param - value is empty, equals mark not provided", () => {
                verifyParamMethod(
                    "http://www.example.com/?aa&bb&cc=1",
                    "bb", ""
                );
            });

            it("should not extract param - as not provided (simple)", () => {
                verifyParamMethod(
                    "http://www.example.com/?a=a123b&b=1&a123b=c&c=sdf&d=dfd",
                    "1234", undefined
                );
            });

            it("should not extract param - as not provided, but such value exist", () => {
                verifyParamMethod(
                    "http://www.example.com/?a=a123b&b=1&a123b=c&c=sdf&d=dfd",
                    "sdf", undefined
                );
            });

            it("should not extract param - as not provided, but has misleading path", () => {
                verifyParamMethod(
                    "http://www.example.com/c=d/?a=b",
                    "c", undefined
                );
            });
        });

        // --------------------------------------------------------------------------------------------------------

        describe("url", () => {

            const verifyUrlMethod: ((locPath: string, params: UrlParam[], expected: string) => void) =
                (locPath, params, expected) => {
                    if ((locPath.match(/\//g) || []).length < 3) {
                        throw new Error("incorrect locPath. use '{0}' instead of '{1}'"
                            .format("http://www.example.com/", "http://www.example.com"));
                    }

                    url_.cLocationPath = () => locPath;
                    const result: string = url_.url(...params);
                    assert_.equals(expected, result);
                };

            it("should accept no params", () => {
                verifyUrlMethod(
                    "http://www.example.com/",
                    [],
                    "http://www.example.com",
                );
            });

            it("should add - more than one full param", () => {
                verifyUrlMethod(
                    "http://www.example.com/",
                    [
                        new UrlParamEx("key1", "value1"),
                        new UrlParamEx("key2", "value2"),
                        new UrlParamEx("key3", "value3"),
                    ],
                    "http://www.example.com/?key1=value1&key2=value2&key3=value3",
                );
            });

            it("should add - one name-only param", () => {
                verifyUrlMethod(
                    "http://www.example.com/",
                    [
                        new UrlParamEx("key", ""),
                    ],
                    "http://www.example.com/?key",
                );
            });

            it("should add - more than one name-only param", () => {
                verifyUrlMethod(
                    "http://www.example.com/",
                    [
                        new UrlParamEx("key1", ""),
                        new UrlParamEx("key2", ""),
                        new UrlParamEx("key3", ""),
                    ],
                    "http://www.example.com/?key1&key2&key3",
                );
            });

            it("should add - mixed types of param", () => {
                verifyUrlMethod(
                    "http://www.example.com/",
                    [
                        new UrlParamEx("key1", ""),
                        new UrlParamEx("key2", "value2"),
                        new UrlParamEx("key3", ""),
                    ],
                    "http://www.example.com/?key1&key2=value2&key3",
                );
            });

            it("should add - key&value need be encoded", () => {
                verifyUrlMethod(
                    "http://www.example.com/",
                    [
                        new UrlParamEx("^key%#", "&value="),
                    ],
                    "http://www.example.com/?%5Ekey%25%23=%26value%3D",
                );
            });

            it("should skip - the only undefined-valued UrlParam", () => {
                verifyUrlMethod(
                    "http://www.example.com/",
                    [
                        new UrlParamEx("a", undefined),
                    ],
                    "http://www.example.com",
                );
            });

            it("should skip - undefined-valued but keep other ones", () => {
                verifyUrlMethod(
                    "http://www.example.com/",
                    [
                        new UrlParamEx("key1", ""),
                        new UrlParamEx("key2", undefined),
                        new UrlParamEx("key3", "val"),
                    ],
                    "http://www.example.com/?key1&key3=val",
                );
            });

            it("should keep loc path - expect protocol, path, sub domain, and path without change", () => {
                verifyUrlMethod(
                    "https://sub.www.example.com:33/ala/x/y",
                    [
                        new UrlParamEx("key", "1"),
                    ],
                    "https://sub.www.example.com:33/ala/x/y?key=1",
                );
            });

            it("should keep loc path - also if there is no param", () => {
                verifyUrlMethod(
                    "https://sub.www.example.com:33/ala/x/y",
                    [],
                    "https://sub.www.example.com:33/ala/x/y",
                );
            });

            it("should keep loc path - also if there is no param & pathname", () => {
                verifyUrlMethod(
                    "https://sub.www.example.com:33/",
                    [],
                    "https://sub.www.example.com:33",
                );
            });
        });
    });
}
