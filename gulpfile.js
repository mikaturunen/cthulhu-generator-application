"use strict";

/**
 * Gulp usage file for the whole project.
 */

var gulp = require("gulp");
var ts = require("gulp-typescript");
var eventStream = require("event-stream");
var tslint = require("gulp-tslint");
var sequence = require("run-sequence").use(gulp);
var babel = require("gulp-babel");
var path = require("path");

var typeScriptSource = ;
var typeScriptDestination = "./release/";

// TYPESCRIPT COMPILATION
gulp.task("ts-back", function() {
    return gulp
        .src([
            "./typedefinitions/backend.d.ts",
            "./backend/**/*.ts"
        ])
        // Pipe source to lint
        .pipe(tslint())
        .pipe(tslint.report("verbose", { emitError: false }))
        // Push through to compiler
        .pipe(ts({
            typescript: require("typescript"),
            target: 'es6',
            sourceMap: true,
            removeComments: false,
            declaration: true,
            noImplicitAny: true,
            failOnTypeErrors: true,
            suppressImplicitAnyIndexErrors: true
        }))
        // Through babel (es6->es5)
        .pipe(babel({
            comments: false,
            presets: [ "es2015" ]
        }))
        .pipe(gulp.dest(path.join(typeScriptDestination, "/backend")));
});

// Frontend compilation
gulp.task("ts-front", function() {
    return gulp
        .src([
            "./typedefinitions/frontend.d.ts",
            "./components/**/*.ts"
        ])
        // Pipe source to lint
        .pipe(tslint())
        .pipe(tslint.report("verbose"))
        // Push through to compiler
        .pipe(ts({
            typescript: require("typescript"),
            target: 'es6',
            sourceMap: true,
            removeComments: false,
            declaration: true,
            noImplicitAny: true,
            failOnTypeErrors: true,
            suppressImplicitAnyIndexErrors: true
        }))
        // Through babel (es6->es5)
        .pipe(babel({
            comments: false,
            presets: [ "es2015" ]
        }))
        .pipe(gulp.dest(path.join(typeScriptDestination, "/components")));

});

/**
 * Run with: 'gulp w'
 */
gulp.task("w", function() {
    gulp.watch(typeScriptSource, [ "ts-back" ]);
});

/**
 * Run with: 'gulp' or 'gulp default'
 */
gulp.task("default", function() {
    return sequence([ "ts-back" ]);
});
