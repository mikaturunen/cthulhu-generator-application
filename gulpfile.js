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
var less = require("gulp-less");
var combiner = require("stream-combiner2");

var typeScriptDestination = "./release/";

// Used to stop the 'watch' behavior from breaking on emited errors, errors should stop the process
// in all other cases but 'watch' as 'watch' is ongoing, iterating, always on process :)
var globalEmit = false;

/**
 * Creates TypeScript compilation for given sources files and outputs them into a preferred release location.
 * Used for frontend and backend TypeScript. They need different compilation locations.
 * @param {String[]} typescriptSources Array of source files
 * @param {String} outputDirectory Location to output the JS files to.
 * @returns {Object} Gulp stream.  
 */
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
        path.join(typeScriptDestination, "/backend")
    );
});

// Frontend compilation
gulp.task("ts-front", function() {
    return createTypeScriptTaskForTargets([
            "./typedefinitions/frontend.d.ts",
            "./typedefinitions/cthulhu.d.ts",
            "./components/**/*.ts"
        ],
        path.join(typeScriptDestination, "/components")
    );
});

// JADE COMPILATION
gulp.task("jade", function() {
    var j = jade({ pretty: true });

    if(globalEmit === false) {
        j.on('error', notify.onError(function (error) {
            return 'An error occurred while compiling Jade.\nLook in the console for details.\n' + error;
        }));
    }

    return gulp.src("./components/**/*.jade")
        .pipe(j)
        .pipe(gulp.dest("./release/components"));
});

gulp.task("less", function() {
    var combined = combiner.obj([
        gulp.src("./components/**/*.less"),
        less(),
        gulp.dest("./release/components")
    ]);

    if (globalEmit === false) {
        combined.on("error", notify.onError(function (error) {
            return 'An error occurred while compiling Less.\nLook in the console for details.\n' + error;
        }))
    }

    return combined;
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

    gulp.watch([
            "./components/**/*.less"
        ],
        [
            "less"
        ]
    );
});

/**
 * Run with: 'gulp' or 'gulp default'
 */
gulp.task("default", function() {
    globalEmit = true;
    return sequence(
        [
            "ts-back",
            "ts-front",
            "jade",
            "less"
        ]
    );
});
