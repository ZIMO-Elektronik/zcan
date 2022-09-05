"use strict";

import gulp from "gulp";
import install from "gulp-install";
import typedoc from "gulp-typedoc";
import {spawn} from "child_process";
import {deleteAsync} from "del";

const docsPath = "./protocol_docs/";

gulp.task("install-zcan-deps", () => {
  return gulp.src(["./package.json"])
    .pipe(install());
})

gulp.task("install-protocol-deps", () => {
  return gulp.src([`${docsPath}package.json`])
    .pipe(install());
})

gulp.task("protocol-docs", () => {
  const isWin = process.platform === "win32";
  const cmd = isWin ? ".cmd" : "";
  return spawn(
    "node_modules\\.bin\\docusaurus" + cmd,
    ["build"],
    {
      cwd: docsPath,
      stdio: "inherit"
    }
  );
})

gulp.task("library-docs", () => {
  return gulp.src(["src/docs_entrypoint.ts"]).pipe(typedoc({
    out: `${docsPath}build/typedoc`,
  }))
})

gulp.task("clean-library", () => {
  return deleteAsync(['docs/']);
})

gulp.task("clean-protocol", () => {
  return deleteAsync([`${docsPath}build` ]);
})

gulp.task("move-docs", () => {
  return gulp
    .src(`${docsPath}build/**/*.*`)
    .pipe(gulp.dest("./docs"));
})

gulp.task("clean", gulp.parallel("clean-library", "clean-protocol"))
gulp.task("finalize-documentation", gulp.series("clean-library", "move-docs"))
gulp.task("install-dependencies", gulp.parallel("install-zcan-deps", "install-protocol-deps"))
gulp.task("documentation", gulp.series("clean", "install-dependencies", "protocol-docs", "library-docs", "finalize-documentation"));
