/// <reference path="assert.impl.ts"/>
/// <reference path="url.impl.ts"/>
/// <reference types="mocha" />

// tslint:disable:no-http-string
namespace url {

    describe("UrlEx", () => {

        let url_: url.UrlEx;

        before(() => {
            url_ = new url.UrlEx();
        });

        describe("param", () => {

            it("should extract param (one provided)", () => {
                url_.cLocationHref = () => "http://none.com/?a=a123b";
                const param: string | null = url_.param("a");

                assert.equals("a123b", param);
            });

            it("should extract param (several provided, first needed)", () => {
                url_.cLocationHref = () => "http://none.com/?a=a123b&b=1&a123b=c&c=sdf&d=dfd";
                const param: string | null = url_.param("a");

                assert.equals("a123b", param);
            });

            it("should extract param (several provided, other needed)", () => {
                url_.cLocationHref = () => "http://none.com/?a=a123b&b=1&a123b=c&c=sdf&d=dfd";
                const param: string | null = url_.param("a123b");

                assert.equals("c", param);
            });

            it("should extract param (several provided, last needed)", () => {
                url_.cLocationHref = () => "http://none.com/?a=a123b&b=1&a123b=c&c=sdf&d=dfd";
                const param: string | null = url_.param("d");

                assert.equals("dfd", param);
            });

            it("should not extract param, as not provided (simple)", () => {
                url_.cLocationHref = () => "http://none.com/?a=a123b&b=1&a123b=c&c=sdf&d=dfd";
                const param: string | null = url_.param("1234");

                assert.equals(null, param);
            });

            it("should not extract param, as not provided (such value exist)", () => {
                url_.cLocationHref = () => "http://none.com/?a=a123b&b=1&a123b=c&c=sdf&d=dfd";
                const param: string | null = url_.param("sdf");

                assert.equals(null, param);
            });
        });
    });
}
