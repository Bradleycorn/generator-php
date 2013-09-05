// Generated on <%= (new Date).toISOString().split('T')[0] %> using <%= pkg.name %> <%= pkg.version %>
'use strict';

// # Folder Paths
// to match only one level down:
// 'test/spec/{,*/}*.js'
// to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // configurable paths
    var yeomanConfig = {
        app: 'app',
        dist: 'dist',
        siteURL: '<%= userOpts.siteURL %>',
        devURL: '<%= userOpts.devURL %>',
        devPort: <%= userOpts.devPort %>
    };

    grunt.initConfig({
        yeoman: yeomanConfig,
        watch: {
            compass: {
                files: ['<%%= yeoman.app %>/_/css/**/*.{scss,sass}'],
                tasks: ['compass:server']
            },
        },
        <% if(userOpts.phpServer) { %>
        php: {
            server: {
                options: {
                    /*keepalive: true,*/
                    hostname: '<%%= yeoman.devURL %>',
                    port: '<%%= yeoman.devPort %>',
                    base: '<%%= yeoman.app %>',
                    router: '../router.php',
                    open: true
                }
            },
            dist: {
                options: {
                    //keepalive: true,
                    hostname: '<%%= yeoman.devURL %>',
                    port: '<%%= yeoman.devPort %>',
                    base: '<%%= yeoman.dist %>',
                    router: '../router-dist.php',
                    open: true
                }
            }
        },
        <% } else { %>
        open: {
            server: {
                path: 'http://<%%= yeoman.devURL %><% if (userOpts.devPort != 80) { %>:<%%= yeoman.devPort %><% } %>'
            }
        },
        <% } %>    
        clean: {
            server: '.tmp',
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%%= yeoman.dist %>/**/*',
                        '!<%%= yeoman.dist %>/.git*'
                    ]
                }]
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                'Gruntfile.js',
                '<%%= yeoman.app %>/_/js/**/*.js',
                '!<%%= yeoman.app %>/_/js/lib/*',
                'test/spec/{,*/}*.js'
            ]
        },
        compass: {
            options: {
                sassDir: '<%%= yeoman.app %>/_/css',
                cssDir: '.tmp/_/css',
                generatedImagesDir: '.tmp/_/img/generated',
                imagesDir: '<%%= yeoman.app %>/_/img',
                javascriptsDir: '<%= yeoman.app %>/_/js',
                importPath: '<%%= yeoman.app %>/_/bower_components',
                httpImagesPath: '/_/img',
                httpGeneratedImagesPath: '/_/img/generated',
                fontsDir: '<%%= yeoman.app %>/_/css/fonts',
                httpFontsPath: '/_/css/fonts',
                relativeAssets: false
            },
            server: {
                options: {
                    debugInfo: true
                }
            },
            dist: {
                options: {
                    generatedImagesDir: '<%%= yeoman.dist %>/_/img/generated'
                }
            }
        },
        rev: {
            dist: {
                files: {
                    src: [
                        <% if (userOpts.revScripts) { %>'<%%= yeoman.dist %>/_/js/**/*.js'<% } if (userOpts.revStyles || userOpts.revImages) { %>,<% } %>
                        <% if (userOpts.revStyles) { %>'<%%= yeoman.dist %>/_/css/**/*.css'<% } if (userOpts.revImages) { %>,<% } %>
                        <% if (userOpts.revImages) { %>'<%%= yeoman.dist %>/_/img/**/*.{png,jpg,jpeg,gif,webp}'<% } %>
                    ]
                }
            }
        },
        useminPrepare: {
            options: {
                dest: '<%%= yeoman.dist %>'
            },
            html: '<%%= yeoman.app %>/**/*{.html,.php}'
        },
        usemin: {
            options: {
                dirs: ['<%%= yeoman.dist %>']
            },
            html: ['<%%= yeoman.dist %>/**/*{.html,.php}'],
            css: ['<%%= yeoman.dist %>/_/css/**/*.css']
        },
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%%= yeoman.app %>/_/img',
                    src: '**/*.{png,jpg,jpeg}',
                    dest: '<%%= yeoman.dist %>/_/img'
                }]
            }
        },
        svgmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%%= yeoman.app %>/_/img',
                    src: '**/*.svg',
                    dest: '<%%= yeoman.dist %>/_/img'
                }]
            }
        },
        cssmin: {
            // This task is pre-configured if you do not wish to use Usemin
            // blocks for your CSS. By default, the Usemin block from your
            // `index.html` will take care of minification, e.g.
            //
            //     <!-- build:css({.tmp,app}) styles/main.css -->
            //
            // dist: {
            //     files: {
            //         '<%= yeoman.dist %>/styles/main.css': [
            //             '.tmp/styles/{,*/}*.css',
            //             '<%= yeoman.app %>/styles/{,*/}*.css'
            //         ]
            //     }
            // }
        },
        // not used since Uglify task does concat,
        // but still available if needed
        /*concat: {
            dist: {}
        },*/
        // not enabled since usemin task does concat and uglify
        // check index.html to edit your build targets
        // enable this task if you prefer defining your build targets here
        /*uglify: {
            dist: {}
        },*/
        htmlmin: {
            dist: {
                options: {
                    /*removeCommentsFromCDATA: true,
                    // https://github.com/yeoman/grunt-usemin/issues/44
                    //collapseWhitespace: true,
                    collapseBooleanAttributes: true,
                    removeAttributeQuotes: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true,
                    removeOptionalTags: true*/
                },
                files: [{
                    expand: true,
                    cwd: '<%%= yeoman.app %>',
                    src: '**/*.{html}',
                    dest: '<%%= yeoman.dist %>'
                }]
            }
        },
        // Put files not handled in other tasks here
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%%= yeoman.app %>',
                    dest: '<%%= yeoman.dist %>',
                    src: [
                        '*.{ico,png,txt}',
                        '.htaccess',
                        '_/img/**/*.{webp,gif}',
                        '_/foundation/images/**/*.{png,jpg,gif}',
                        '_/css/fonts/*',
                        '**/*.php'
                    ]
                }]
            }
        },
        concurrent: {
            dist: [
                'compass',
                'imagemin',
                'svgmin',
                'htmlmin'
            ]
        }
    });

    grunt.registerTask('server', function (target) {
        if (target === 'dist') {
            <% if (userOpts.phpServer) { %>
            return grunt.task.run(['build', 'php:dist:keepalive']);
            <% } else { %>
            return grunt.task.run(['build', 'open:server']);    
            <% } %>
        }

        grunt.task.run([
            'clean:server',
            'compass',<% if (userOpts.phpServer) { %>
            'php:server' <% } else { %> 'open:server'<% } %>,            
            'watch'
        ]);
    });

    grunt.registerTask('build', [
        'clean:dist',
        'useminPrepare',
        'concurrent:dist',
        'concat',
        'cssmin',
        'uglify',
        'copy:dist',
        'rev',
        'usemin'
    ]);

    grunt.registerTask('default', [
        //'jshint',
        //'test',
        'build'
    ]);
};
