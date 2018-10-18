// tslint:disable:no-expression-statement
import test from 'ava';
import configFromCodacy from './codacy-configuration';

test('read inexistant codacy configuration file', async t => {
  t.deepEqual(
    await configFromCodacy(
      './test_samples/configs/tslint-config-file/codacyrc'
    ),
    {}
  );
});

test('read valid codacy configuration file with only files', async t => {
  t.deepEqual(
    await configFromCodacy(
      './test_samples/configs/codacy-config-file-only-files/codacyrc'
    ),
    {
      files: ['test.ts'],
      rawConfig: undefined
    }
  );
});

test('read valid codacy configuration file', async t => {
  t.deepEqual(
    await configFromCodacy(
      './test_samples/configs/codacy-config-file-with-files-and-patterns/codacyrc'
    ),
    {
      files: ['test.ts'],
      rawConfig: { rules: { 'no-expression-statement': true } }
    }
  );
});
