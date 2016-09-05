module.exports = function (grunt) {
    grunt.initConfig({
        copy: {
            main: {
                files: [
                    {
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
                    }
                ]
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.registerTask("some", ["copy"]);
};
