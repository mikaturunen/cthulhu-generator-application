"use strict";

const gulp = require("gulp");
const sequence = require("run-sequence").use(gulp);
const buildSteps = require("./javascript-build-essentials/build/shared-gulpfile");

const outputDirectory = "./release/";

gulp.task("ts-back", () => buildSteps.createTypeScriptTask([ "./backend/**/*.ts", "./typedefinitions/backend.d.ts" ], outputDirectory));
gulp.task("ts-front", () => buildSteps.createTypeScriptTask([ "./components/**/*.ts", "./typedefinitions/frontend.d.ts" ], outputDirectory));
gulp.task("jade", () => buildSteps.createJadeTask([ "./components/**/*.jade" ], outputDirectory));
gulp.task("less", () => buildSteps.createLessTask([ "./components/**/*.less" ], outputDirectory));


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

gulp.task("default", () => {
    buildSteps.globalEmitOn();
    return sequence([
		"ts-back",
		"ts-front",
		"jade",
		"less"
	]);
});
