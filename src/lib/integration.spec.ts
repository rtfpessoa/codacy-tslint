// tslint:disable:no-expression-statement
import test from 'ava';
import * as path from 'path';
import run from './tslint-runner';

test('run integration test no-magic-numbers and interface-name', async t => {
  const testsPath = path.join(
    process.cwd(),
    'test_samples/repositories/integration'
  );
  const results = await run({
    codacyConfigPath: `${testsPath}/codacyrc`,
    sourcePath: testsPath
  });

  t.deepEqual(results, [
    {
      file: 'test.ts',
      line: 5,
      message: 'interface name must start with a capitalized I',
      patternId: 'interface-name'
    },
    {
      file: 'test.ts',
      line: 9,
      message: "'magic numbers' are not allowed",
      patternId: 'no-magic-numbers'
    }
  ]);
});
