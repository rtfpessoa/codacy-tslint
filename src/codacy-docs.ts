#!/usr/bin/env node

import fs from 'fs-extra';
import path from 'path';
import { findRule, RuleConstructor, RuleType } from 'tslint';
import * as configs from 'tslint/lib/configs/all';

const allRules: ReadonlyArray<RuleConstructor> = Object.keys(configs.rules)
  .map(ruleName => {
    const rule = findRule(ruleName);

    if (!rule) {
      return;
    }

    return rule;
  })
  .filter(rule => rule !== undefined) as ReadonlyArray<RuleConstructor>;

const root = path.resolve(__dirname);
const docsPath = path.resolve(`${root}/../../docs`);
const descripionPath = path.resolve(`${docsPath}/description`);

/* tslint:disable:no-expression-statement*/

if (fs.existsSync(docsPath)) {
  fs.removeSync(docsPath);
}

fs.mkdirSync(docsPath);
fs.mkdirSync(descripionPath);

fs.writeFileSync(
  `${docsPath}/patterns.json`,
  JSON.stringify(getPatterns(allRules), null, 2)
);

fs.writeFileSync(
  `${descripionPath}/description.json`,
  JSON.stringify(getDescriptions(allRules), null, 2)
);

allRules.forEach((rule: RuleConstructor) => {
  const descriptionParts = [
    rule.metadata.description,
    rule.metadata.descriptionDetails,
    rule.metadata.rationale,
    rule.metadata.optionsDescription,
    rule.metadata.codeExamples
  ]
    .filter(part => part !== undefined)
    .join('\n\n');

  fs.writeFileSync(
    `${descripionPath}/${rule.metadata.ruleName}.md`,
    descriptionParts
  );
});

fs.writeFileSync(
  `${docsPath}/tool-description.md`,
  `TSLint is an extensible static analysis tool that checks TypeScript code for readability,
maintainability, and functionality errors.
It is widely supported across modern editors & build systems and can be customized with your own lint rules,
configurations, and formatters.`
);

/* tslint:enable:no-expression-statement*/

function getPatterns(rules: ReadonlyArray<RuleConstructor>): object {
  const patterns = rules.map((rule: RuleConstructor) => {
    const parameters = rule.metadata.options
      ? {
          parameters: [
            {
              default:
                (rule.metadata.optionExamples &&
                  rule.metadata.optionExamples[0]) ||
                null,
              name: rule.metadata.ruleName
            }
          ]
        }
      : {};

    return {
      ...parameters,
      category: getCategory(rule.metadata.type),
      level: 'Warning',
      patternId: rule.metadata.ruleName
    };
  });

  // tslint:disable-next-line:no-unsafe-any
  const toolVersion = require('../../package.json').dependencies.tslint.replace(
    '^',
    ''
  );

  return { name: 'tslint', patterns, version: toolVersion };
}

function getDescriptions(
  rules: ReadonlyArray<RuleConstructor>
): ReadonlyArray<object> {
  return rules.map((rule: RuleConstructor) => {
    const parameters = rule.metadata.options
      ? {
          parameters: [
            {
              description: rule.metadata.ruleName,
              name: rule.metadata.ruleName
            }
          ]
        }
      : {};

    return {
      ...parameters,
      description:
        rule.metadata.descriptionDetails || rule.metadata.description,
      patternId: rule.metadata.ruleName,
      timeToFix: 5,
      title: rule.metadata.description
    };
  });
}

// Security, CodeStyle, ErrorProne, Performance, Compatibility, UnusedCode
function getCategory(type: RuleType): string {
  switch (type) {
    case 'functionality': {
      return 'CodeStyle';
    }
    case 'maintainability': {
      return 'ErrorProne';
    }
    case 'typescript': {
      return 'ErrorProne';
    }
    default: {
      return 'CodeStyle';
    }
  }
}
