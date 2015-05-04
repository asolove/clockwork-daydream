module.exports = function(grunt) {
    // loads any modules starting with 'grunt-'
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        // TODO add jsx linting
        // TODO add jscs/jsxcs
        // lint plain js sources
        jshint: {
            all: [ 'index.js', 'src/script/**/*.js' ]
        },

        clean: {
            all: [ 'build', 'dist' ]
        },

        // transpile .jsx files to .js via grunt-react
        react: {
            files: {
                expand: true,
                cwd: 'src',
                src: [
                    '**/*.jsx',
                ],
                dest: 'build',
                rename: function(dest, src) {
                    return dest + '/' + src.replace('.jsx', '.js');
                }
            }
        },

        copy: {
            main: {
                files: [{
                    expand: true,
                    cwd: 'src/',
                    src: [ '**/*.js' ],
                    dest: 'build/'
                }]
            }
        },

        // bundle from the root script out of plain and transpiled sources
        browserify: {
            main: {
                src: 'build/script/index.js',
                dest: 'dist/jirastats.js'
            }
        },

        // watch for file changes, running the appropriate grunt task
        watch: {
            scripts: {
                files: [
                    'src/**/*.{js,jsx}'
                ],
                tasks: ['build']
            }
        }
    });

    grunt.registerTask('default', [ 'clean', 'build' ]);

    grunt.registerTask('build', 'Build and bundle scripts', [
        'jshint',
        'newer:copy',
        'newer:react',
        'newer:browserify'
    ]);
};
