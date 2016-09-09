module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({

        copy: {
            js: {
                files: [{
                    expand: true,
                    cwd: "node_bower/jquery/dist/",
                    src: "*",
                    dest: "src/main/resources/static/js/lib/jquery/"
                }, {
                    expand: true,
                    cwd: "node_bower/jquery-ui/",
                    src: "jquery-ui*",
                    dest: "src/main/resources/static/js/lib/jquery-ui/"
                }, {
                    expand: true,
                    cwd: "node_bower/js-cookie/src/",
                    src: "js.cookie*",
                    dest: "src/main/resources/static/js/lib/js-cookie/"
                }, {
                    expand: true,
                    cwd: "node_modules/babel-polyfill/dist/",
                    src: "polyfill*",
                    dest: "src/main/resources/static/js/lib/babel-polyfill/"
                }]
            }
        },

        babel: {
            convert: {
                options: {
                    presets: ["es2015"],
                    sourceMap: true,
                    comments: false,
                },
                files: [{
                    expand: true,
                    cwd: "src/main/resources/static/js/",
                    src: "app.es6.js",
                    dest: "src/main/resources/static/js/",
                    rename: function (dest, src) {
                        return dest + src.replace("es6", "es5");
                    }
                }]

            },

            minify: {
                options: {
                    presets: ["babili"],
                    sourceMap: true,
                    comments: false,
                },

                files: [{
                    expand: true,
                    cwd: "src/main/resources/static/js/",
                    src: "app.es?.js",
                    dest: "src/main/resources/static/js/",
                    rename: function (dest, src) {
                        return dest + src.replace(".js", ".min.js");
                    }
                }]

            }
        }
    });

    grunt.registerTask("cb", ["copy:js"]);
    grunt.registerTask("cm", ["babel:convert", "babel:minify"]);
};
