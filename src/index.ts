#!/usr/bin/env node

import run from './lib/tslint-runner';

// tslint:disable:no-expression-statement
try {
  const results = run();

  results.forEach(result => {
    process.stdout.write(`${JSON.stringify(result)}\n`);
  });

  process.exit(0);
} catch (err) {
  const error = err as Error;
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exit(1);
}
// tslint:enable:no-expression-statement
