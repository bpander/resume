/*jshint node:true, laxbreak:true */
'use strict';

module.exports = function(grunt) {
    var shouldMinify = !grunt.option('dev');

    grunt.config.merge({
        // Copies static files for non-optimized builds
        copy: {
            buildStyles: {
                files: [{
                    expand: true,
                    cwd: '<%= env.DIR_SRC %>',
                    dest: '<%= env.DIR_DEST %>',
                    src: ['assets/{styles,vendor}/**/*.css']
                }]
            }
        },

        sass: {
            buildStyles: {
                files: [{
                    expand: true,
                    cwd: '<%= env.DIR_SRC %>/assets/scss',
                    src: ['*.scss'],
                    dest: '<%= env.DIR_DEST %>/assets/styles',
                    ext: '.css'
                }],
                options: {
                    outputStyle: (shouldMinify ? 'compressed' : 'nested')
                }
            }
        }
    });

    grunt.registerTask('scrub:buildStyles', function() {
        function scrub(name) {
            var config = JSON
                .stringify(grunt.config.get(name))
                .replace(/\?v=@@version/g, '');

            grunt.config.set(name, JSON.parse(config));
        }
    });

    grunt.registerTask('buildStyles',
        shouldMinify
            ? [
                'sass:buildStyles',
                'scrub:buildStyles',
            ]
            : [
                'copy:buildStyles',
                'sass:buildStyles'
            ]
    );
};
