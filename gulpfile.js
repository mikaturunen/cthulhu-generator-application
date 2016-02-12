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

var typeScriptSource = [
    "./typedefinitions/backend.d.ts",
    "./backend/**/*.ts"
];
var typeScriptDestination = "./release/";

// TYPESCRIPT COMPILATION
gulp.task("typescript", function() {
    return gulp
        .src( typeScriptSource )
        // Pipe source to lint
        .pipe(tslint())
        .pipe(tslint.report("verbose"))
        // Push through to compiler
        .pipe(ts({
            typescript: require("typescript"),
            declarationFiles: false,
            noImplicitAny: true,
            noExternalResolve: false,
            removeComments: true,
            target: "es6",
            showErrors: true
        }))
        // Through babel (es6->es5)
        .pipe(babel({
            comments: false,
            presets: [ "es2015" ]
        }))
        .pipe(gulp.dest(typeScriptDestination));

});

/**
 * Run with: 'gulp w'
 */
gulp.task("w", function() {
    gulp.watch(typeScriptSource, [ "typescript" ]);
});

/**
 * Run with: 'gulp' or 'gulp default'
 */
gulp.task("default", function() {
    return sequence([ "typescript" ]);
});
