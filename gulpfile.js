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
var jade = require("gulp-jade");
var notify = require("gulp-notify");

var typeScriptDestination = "./release/";
var globalEmit = false;

var createTypeScriptTaskForTargets = function(typescriptSources, outputDirectory) {
    return gulp
        .src(typescriptSources)
        // Pipe source to lint
        .pipe(tslint())
        .pipe(tslint.report("verbose", { emitError: globalEmit }))
        // Push through to compiler
        .pipe(ts({
            typescript: require("typescript"),
            target: "es6",
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
        .pipe(gulp.dest(outputDirectory));
};

// TYPESCRIPT COMPILATION
gulp.task("ts-back", function() {
    return createTypeScriptTaskForTargets([
            "./typedefinitions/backend.d.ts",
            "./typedefinitions/cthulhu.d.ts",
            "./backend/**/*.ts"
        ],
        path.join(typeScriptDestination, "/components")
    );
});

// Frontend compilation
gulp.task("ts-front", function() {
    return createTypeScriptTaskForTargets([
            "./typedefinitions/frontend.d.ts",
            "./typedefinitions/cthulhu.d.ts",
            "./components/**/*.ts"
        ],
        path.join(typeScriptDestination, "/backend")
    );
});

// JADE COMPILATION
gulp.task("jade", function() {
    var j = jade({ pretty: true });

    if(globalEmit === false) {
        j.on('error', notify.onError(function (error) {
            return 'An error occurred while compiling jade.\nLook in the console for details.\n' + error;
        }));
    }

    return gulp.src("./components/**/*.jade")
        .pipe(j)
        .pipe(gulp.dest("./release/components"));
});

/**
 * Run with: 'gulp w'
 */
gulp.task("w", function() {
    globalEmit = false;
    gulp.watch([
            "./typedefinitions/**/*d.ts",
            "./backend/**/*.ts"
        ],
        [
	       "ts-back"
        ]
	);

    gulp.watch([
            "./typedefinitions/**/*d.ts",
            "./components/**/*.ts"
        ],
        [
            "ts-front"
        ]
    );

    gulp.watch([
            "./components/**/*.jade"
        ],
        [
            "jade"
        ]
    );
});

/**
 * Run with: 'gulp' or 'gulp default'
 */
gulp.task("default", function() {
    globalEmit = true;
    return sequence(
        [ "ts-back", "jade", "ts-front" ]
    );
});
