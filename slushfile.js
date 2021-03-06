/*
 * slush-webapp
 * https://github.com/jonkemp/slush-webapp
 *
 * Copyright (c) 2014, Jonathan Kemp
 * Licensed under the MIT license.
 */

'use strict';

var gulp = require('gulp'),
    install = require('gulp-install'),
    conflict = require('gulp-conflict'),
    template = require('gulp-template'),
    rename = require('gulp-rename'),
    _s = require('underscore.string'),
    inquirer = require('inquirer');

gulp.task('default', function (done) {
    inquirer.prompt([
            {
                // Get app name from arguments by default
                type: 'input',
                name: 'appname',
                message: 'Give your app a name',
                default: gulp.args.join(' ')
            },
            {
                type: 'confirm',
                name: 'moveon',
                message: 'Continue?'}
        ],
        function (answers) {
            if (!answers.moveon) {
                return done();
            }

            answers.appNameSlug = _s.slugify(answers.appname);

            gulp.src(__dirname + '/templates/**')
                .pipe(template(answers))
                .pipe(rename(function(file) {
                    if (file.basename[0] === '_') {
                        file.basename = '.' + file.basename.slice(1);
                    }
                }))
                .pipe(conflict('./'))
                .pipe(gulp.dest('./'))
                .pipe(install())
                .on('end', function () {
                    done();
                });
        });
});
