import fs from 'fs';
import path from 'path';
import * as tslint from 'tslint';
import { parseConfigFile } from 'tslint/lib/configuration';
import configFromCodacy, { Configuration } from './codacy-configuration';
import collectFiles from './util/fileCollector';

interface CodacyIssue {
  readonly file: string;
  readonly message: string;
  readonly patternId: string;
  readonly line: number;
}

export default function run(
  options: {
    readonly sourcePath?: string;
    readonly codacyConfigPath?: string;
    readonly getCodacyConfiguration?: (path: string) => Configuration;
  } = {}
): ReadonlyArray<CodacyIssue> {
  const {
    sourcePath = '/src',
    codacyConfigPath = '/.codacyrc',
    getCodacyConfiguration = configFromCodacy
  } = options;

  const { rawConfig, files } = getCodacyConfiguration(codacyConfigPath);
  const configuration = rawConfig
    ? parseConfigFile(rawConfig)
    : tslint.Configuration.findConfiguration(null, sourcePath).results;

  const linterOptions = {
    fix: false,
    formatter: 'json'
  };

  const filesToAnalyse = files ? files : collectFiles(sourcePath);

  const linter = new tslint.Linter(linterOptions);

  /* tslint:disable:no-expression-statement*/
  filesToAnalyse.forEach(fileName => {
    const filePath = path.resolve(sourcePath, fileName);
    const contents = fs.readFileSync(filePath, 'utf8');
    return linter.lint(filePath, contents, configuration);
  });
  /* tslint:enable:no-expression-statement*/

  return getCodacyIssues(sourcePath, linter.getResult().failures);
}

function getCodacyIssues(
  sourcePath: string,
  results: ReadonlyArray<tslint.RuleFailure>
): ReadonlyArray<CodacyIssue> {
  return results.map((result: tslint.RuleFailure) => {
    return {
      file: path.relative(sourcePath, result.getFileName()),
      line: result.getStartPosition().getLineAndCharacter().line + 1,
      message: result.getFailure(),
      patternId: result.getRuleName()
    };
  });
}
