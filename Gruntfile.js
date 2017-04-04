module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: ['src/services/*.js','src/controllers/*.js'],
                dest: 'dist/js/main.js'
            }
        },
        uglify: {
            options:{
              beautify:true
            },

            dist: {
                files: {
                    'dist/js/main.js':['src/services/*.js','src/controllers/*.js'],
                }
            }
        },
        qunit: {
            all: ['index.html','views/**/*.html']
        },
        jshint: {
            files: ['Gruntfile.js','app.js', 'src/**/*.js'],
            options: {
                // options here to override JSHint defaults
                globals: {
                    jQuery: true,
                    console: true,
                    module: true,
                    document: true
                }
            }
        },
        cssmin: {
            minify: {

                    src: ['src/css/*.css'],
                    dest: 'dist/css/mail_box.min.css',
                    ext: '.min.css'
            }
        },
        watch: {
            files: ['<%= jshint.files %>'],
            tasks: ['jshint', 'qunit']
        },
        open : {
            options: {
                openOn: 'serverListening'
            },
            server: {
                url: 'http://localhost:9000',
                app: 'firefox'
            }
        },
        connect: {
            server: {
                options: {
                    port: 9001,
                    hostname: 'localhost'
                }
            }
        }
    });

    //grunt.loadNpmTasks('grunt-contrib-clean');
   // grunt.loadNpmTasks('grunt-open');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    //grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-serve');
    //grunt.loadNpmTasks('grunt-contrib-connect');
    //grunt.registerTask('test', ['clean']);
    grunt.registerTask('default', ['serve']);
    grunt.registerTask('default', ['jshint','cssmin', 'concat', 'uglify','serve']);

};