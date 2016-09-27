module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);

    const path =
        (file) => "src/main/resources/static/js" + file;

    const json =
        (path) => (
            grunt.file.isFile(path)
            && grunt.file.readJSON(path)
        );

    grunt.initConfig({

        copy: {
            tsTypes: {
                files: [{
                    expand: true,
                    cwd: "node_modules/@types/",
                    src: "**",
                    dest: "node_types"
                }]
            },

            jsLib: {
                files: [{
                    expand: true,
                    cwd: "node_bower/jquery/dist/",
                    src: "*",
                    dest: path("/lib/jquery/")
                }, {
                    expand: true,
                    cwd: "node_bower/jquery-ui/",
                    src: "jquery-ui*",
                    dest: path("/lib/jquery-ui/")
                }, {
                    expand: true,
                    cwd: "node_bower/js-cookie/src/",
                    src: "js.cookie*",
                    dest: path("/lib/js-cookie/")
                }, {
                    expand: true,
                    cwd: "node_modules/babel-polyfill/dist/",
                    src: "polyfill*",
                    dest: path("/lib/babel-polyfill/")
                }]
            }
        },

        babel: {
            convert7: {
                options: {
                    presets: ["babili"],
                    // passPerPreset: true,
                    sourceMap: true,
                    inputSourceMap: json(path("/app.es7-ts.js.map")),
                    comments: false,
                },
                files: [{
                    expand: true,
                    cwd: path("/"),
                    src: "app.es7-ts.js",
                    dest: path("/"),
                    rename: function (dest, src) {
                        return (dest + src)
                            .replace("es7-ts", "es7-babel")
                            .replace(".js", ".min.js")

                    }
                }]
            },

            convert5: {
                options: {
                    presets: ["es2015", "es2016", "babili"],
                    // passPerPreset: true,
                    sourceMap: true,
                    inputSourceMap: json(path("/app.es7-ts.js.map")),
                    comments: false,
                },
                files: [{
                    expand: true,
                    cwd: path("/"),
                    src: "app.es7-ts.js",
                    dest: path("/"),
                    rename: function (dest, src) {
                        return (dest + src)
                            .replace("es7-ts", "es5-babel")
                            .replace(".js", ".min.js")
                    }
                }]
            },
        }
    });

    grunt.registerTask("copy-ts-types", ["copy:tsTypes"]);
    grunt.registerTask("copy-js-lib", ["copy:jsLib"]);
    grunt.registerTask("babel-convert", ["babel:convert7", "babel:convert5"]);
};
