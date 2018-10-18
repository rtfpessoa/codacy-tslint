// tslint:disable:no-expression-statement
import test from 'ava';
import * as path from 'path';
import { Configuration, EmptyConfiguration } from './codacy-configuration';
import run from './tslint-runner';

test('run analysis when codacy config file is not found but has tslint.json', async t => {
  const testsPath = path.join(
    process.cwd(),
    'test_samples/repositories/tslint-file-simple'
  );
  const results = await run({
    getCodacyConfiguration: () => EmptyConfiguration,
    sourcePath: testsPath
  });

  t.deepEqual(results, [
    {
      file: 'test.ts',
      line: 1,
      message: 'require statement not part of an import statement',
      patternId: 'no-var-requires'
    }
  ]);
});

test('run analysis when codacy config file is found with only files', async t => {
  const testsPath = path.join(
    process.cwd(),
    'test_samples/repositories/tslint-config-file'
  );
  const results = await run({
    getCodacyConfiguration: () => {
      const config: Configuration = { files: ['test.ts'] };
      return config;
    },
    sourcePath: testsPath
  });

  t.deepEqual(results, [
    {
      file: 'test.ts',
      line: 5,
      message: 'interface name must start with a capitalized I',
      patternId: 'interface-name'
    }
  ]);
});

test('run analysis when codacy config file is found with files and patterns', async t => {
  const testsPath = path.join(
    process.cwd(),
    'test_samples/repositories/tslint-config-file'
  );
  const results = await run({
    getCodacyConfiguration: () => {
      const config: Configuration = {
        files: ['test.ts', 'test2.ts'],
        rawConfig: { rules: { 'no-magic-numbers': true } }
      };
      return config;
    },
    sourcePath: testsPath
  });

  t.deepEqual(results, [
    {
      file: 'test.ts',
      line: 9,
      message: "'magic numbers' are not allowed",
      patternId: 'no-magic-numbers'
    },
    {
      file: 'test2.ts',
      line: 3,
      message: "'magic numbers' are not allowed",
      patternId: 'no-magic-numbers'
    }
  ]);
});
