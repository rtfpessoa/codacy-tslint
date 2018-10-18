import {
  RawConfigFile,
  RawRuleConfig,
  RawRulesConfig
} from 'tslint/lib/configuration';
import readFile from './util/file';

type ParameterValueScalar = string | number | boolean | object;
interface ParameterValueArray {
  readonly [index: number]: ParameterValueScalar | ParameterValueArray;
}

export type ParameterValue =
  | ParameterValueScalar
  | ParameterValueArray
  | ReadonlyArray<any>;

export const EmptyConfiguration: Configuration = {};

export interface Configuration {
  readonly files?: ReadonlyArray<string>;
  readonly rawConfig?: RawConfigFile;
}

interface CodacyParameter {
  readonly name: string;
  readonly value: ParameterValue;
}

interface CodacyPattern {
  readonly patternId: string;
  readonly parameters?: ReadonlyArray<CodacyParameter>;
}

interface CodacyTool {
  readonly name: string;
  readonly patterns?: ReadonlyArray<CodacyPattern>;
}

interface CodacyConfiguration {
  readonly files: ReadonlyArray<string>;
  readonly tools?: ReadonlyArray<CodacyTool>;
}

export default function configFromCodacy(configPath?: string): Configuration {
  const codacyConfig = parseCodacyConfiguration(configPath);

  if (!codacyConfig) {
    return {};
  }

  return {
    files: codacyConfig.files,
    rawConfig: getRawConfigFile(codacyConfig)
  };
}

function parseCodacyConfiguration(
  configPath?: string
): CodacyConfiguration | undefined {
  const path = configPath || '/.codacyrc';
  const configFileContents = readFile(path);

  if (!configFileContents) {
    return;
  }

  try {
    const codacyConfig = JSON.parse(configFileContents) as CodacyConfiguration;
    return codacyConfig;
  } catch (err) {
    // tslint:disable-next-line:no-expression-statement
    process.stderr.write(`${err}\n`);
    process.exit(50);
    return;
  }
}

function getRawConfigFile(
  codacyConfig: CodacyConfiguration
): RawConfigFile | undefined {
  if (codacyConfig.tools) {
    const toolPatterns = codacyConfig.tools.find(
      (tool: CodacyTool) => tool.name === 'tslint'
    );

    if (toolPatterns && toolPatterns.patterns) {
      const rulesArray: ReadonlyArray<
        RawRulesConfig
      > = toolPatterns.patterns.map((pattern: CodacyPattern) => {
        const parameter =
          pattern.parameters && pattern.parameters.length === 1
            ? pattern.parameters[0].value
            : true;

        const wrappedParameter: RawRuleConfig =
          typeof parameter === 'boolean' || parameter instanceof Array
            ? parameter
            : [parameter];

        return { [pattern.patternId]: wrappedParameter };
      });

      const rules =
        rulesArray.length < 2
          ? rulesArray[0] || {}
          : rulesArray.reduce((previousValue, currentValue) => {
              return { ...previousValue, ...currentValue };
            });

      return { rules };
    }
  }

  return;
}
