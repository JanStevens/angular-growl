module.exports = function (grunt) {
    "use strict";

    grunt.initConfig({

        pkg: grunt.file.readJSON('bower.json'),
        icons: grunt.option('icons') || 'dark',
        language: grunt.option('lang') || 'en',

        meta: {
            banner: '/**\n * <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
                '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
                ' * <%= pkg.homepage %>\n' +
                ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>;' +
                ' Licensed <%= pkg.license %>\n */\n'
        },

        build_dir: 'build',
        lib_files: {

            core: [
            'src/growl.js',
            'src/growlDirective.js',
            'src/growlFactory.js',
            'src/growlMessageService.js'
            ],
            cssbootstrap: [
            'src/growl.css',
            'src/growl.bootstrap.css'
            ],
            cssfoundation: [
            'src/growl.css',
            'src/growl.foundation.css'
            ],
            test: ['test/**/*.js']
        },
        watch: {

            scripts: {
                files: ['gruntfile.js', '<%= lib_files.core %>', '<%= lib_files.test %>'],
                tasks: ['jshint:all', 'karma:unit']
            },

            livereload: {
                options: {
                    livereload: true
                },
                files: ['src/**/*.*'],
                tasks: ['jshint', 'karma:unit']
            }
        },

        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },

            all: ['gruntfile.js', '<%= lib_files.core %>', '<%= lib_files.test %>'],

            core: {
                files: {
                    src: ['<%= lib_files.core %>']
                }
            },

            test: {
                files: {
                    src: ['<%= lib_files.test %>']
                }
            }
        },

        concat: {
            banner: {
                options: {
                    banner: '<%= meta.banner %>'
                },
                src: '<%= concat.core.dest %>',
                dest: '<%= concat.core.dest %>',
            },

            core: {
                src: ['<%= lib_files.core %>'],
                dest: '<%= build_dir %>/angular-growl.js'
            },
            cssbootstrap: {
                options: {
                    banner: '<%= meta.banner %>'
                },
                src: ['<%= lib_files.cssbootstrap %>'],
                dest: '<%= build_dir %>/angular-growl-bootstrap.css'
            },
            cssfoundation: {
                options: {
                    banner: '<%= meta.banner %>'
                },
                src: ['<%= lib_files.cssfoundation %>'],
                dest: '<%= build_dir %>/angular-growl-foundation.css'
            }
        },
        cssmin: {
            corebootrap: {
                files: {
                    'build/angular-growl.bootstrap.min.css': '<%= lib_files.cssbootstrap %>'
                },
                options: {
                    'banner': '<%= meta.banner %>',
                    'report': 'gzip'
                }
            },
            corefoundation: {
                files: {
                    'build/angular-growl.foundation.min.css': '<%= lib_files.cssfoundation %>'
                },
                options: {
                    'banner': '<%= meta.banner %>',
                    'report': 'gzip'
                }
            }
        },

        uglify: {
            core: {
                files: {
                    '<%= build_dir %>/angular-growl.min.js': '<%= concat.core.dest %>'
                },
                options: {
                    banner: '<%= meta.banner %>',
                    report: 'gzip'
                }
            }
        },

        karma: {
            unit: {
                configFile: 'karma.conf.js',
                singleRun: true
            }
        },

        ngmin: {
            core: {
                src: '<%= concat.core.dest %>',
                dest: '<%= concat.core.dest %>'
            }
        },
        push: {
            options: {
                files: ['package.json', 'bower.json'],
                add: true,
                addFiles: ['.'], // '.' for all files except ingored files in .gitignore
                commit: true,
                commitMessage: 'Release v%VERSION%',
                commitFiles: ['package.json', 'bower.json', 'build/angular-growl.js', 'build/angular-growl.min.js', 'build/angular-growl.bootstrap.min.css', 'build/angular-growl.foundation.min.css', 'README.md'], // '-a' for all files
                createTag: true,
                tagName: 'v%VERSION%',
                tagMessage: 'Version %VERSION%',
                push: true,
                pushTo: 'origin',
                npm: true,
                npmTag: 'Release v%VERSION%',
                gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d' // options to use with '$ git describe'
            }
        }
    });


    grunt.registerTask('default', ['jshint:all', 'karma']);
    grunt.registerTask('test', ['karma']);

    grunt.registerTask('build', [
      'jshint:all',
      'karma',
      'build:core'
     ]);

    grunt.registerTask('build:core', [
      'concat:core',
      'concat:cssbootstrap',
      'concat:cssfoundation',
      'ngmin:core',
      'concat:banner',
      'uglify:core',
      'cssmin:corebootrap',
      'cssmin:corefoundation',
     ]);

    // For development purpose.
    grunt.registerTask('dev', ['jshint', 'karma:unit', 'watch:livereload']);

    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
};