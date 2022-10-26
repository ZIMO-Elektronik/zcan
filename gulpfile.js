'use strict';

import gulp from 'gulp';
import typedoc from 'gulp-typedoc';
import {spawn} from 'child_process';
import {deleteAsync} from 'del';

const docsPath = './protocol_docs/';

gulp.task('protocol-docs', () => {
  const isWin = process.platform === 'win32';
  const cmd = isWin ? '.cmd' : '';
  return spawn('node_modules/.bin/docusaurus' + cmd, ['build'], {
    cwd: docsPath,
    stdio: 'inherit',
  });
});

gulp.task('library-docs', () => {
  return gulp.src(['src/docs_entrypoint.ts']).pipe(
    typedoc({
      out: `${docsPath}build/typedoc/`,
    }),
  );
});

gulp.task('clean-protocol', () => {
  return deleteAsync([`${docsPath}build`]);
});

gulp.task(
  'documentation',
  gulp.series('clean-protocol', 'protocol-docs', 'library-docs'),
);
