/*jshint node:true, laxbreak:true */
'use strict';

module.exports = function(grunt) {

    // -- Plugins --------------------------------------------------------------

    // Uncomment the next line to report the Grunt execution time (for optimization, etc)
    // require('time-grunt')(grunt);

    // Intelligently lazy-loads tasks and plugins as needed at runtime.
    require('jit-grunt')(grunt, { versioncheck: 'grunt-version-check' })({ customTasksDir: 'tools/tasks' });

    // -- Options --------------------------------------------------------------

    // All builds are considered to be development builds, unless they're not.
    grunt.option('dev', !grunt.option('stage') && !grunt.option('prod'));

    // -- Configuration --------------------------------------------------------

    grunt.initConfig({
        // Load `package.json`so we have access to the project metadata such as name and version number.
        pkg: require('./package.json'),

        // Load `build-env.js`so we have access to the project environment configuration and constants.
        env: require('./build-env'),

        // Removes generated files and directories. Useful for rebuilding with fresh copies of everything.
        clean: {
            options: {
                force: '<%= env.UNSAFE_MODE %>'
            },
            dest: ['<%= env.DIR_DEST %>'],
            docs: ['<%= env.DIR_DOCS %>'],
            tmp: ['<%= env.DIR_TMP %>'],
            installed: [
                'tools/node-*',
                '<%= env.DIR_BOWER %>',
                '<%= env.DIR_NPM %>'
            ]
        },

        // Watches files and directories changes and runs associated tasks automatically.
        // For LiveReload, download browser extension at http://go.livereload.com/extensions
        watch: {
            options: {
                livereload: {
                    // Default port for LiveReload
                    // *Will not work if multiple users run using the same port on a shared server*
                    port: 35729
                }
            },
            watchMarkup: {
                files: ['<%= env.DIR_SRC %>/**/*.html'],
                tasks: ['buildMarkup']
            },
            watchStatic: {
                files: [
                    '<%= env.DIR_SRC %>/assets/media/**'
                ],
                tasks: ['buildStatic']
            },
            watchStyles: {
                files: ['<%= env.DIR_SRC %>/assets/scss/**/*'],
                tasks: ['buildStyles']
            }
        },
    });

    // -- Tasks ----------------------------------------------------------------

    grunt.registerTask('default', 'Run default tasks for the target environment.', ['build']);
    grunt.registerTask(
        'build',
        'Compile source code and outputs to destination.',
        ['clean:dest', 'buildMarkup', 'buildStatic', 'buildStyles', 'clean:tmp']
    );

    grunt.loadNpmTasks('grunt-contrib-watch');
};
