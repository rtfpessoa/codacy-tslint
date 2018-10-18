# codacy-tslint

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/65d66b1b6f134ef6b7225d2b66a8987d)](https://www.codacy.com/app/Codacy/codacy-tslint?utm_source=github.com&utm_medium=referral&utm_content=codacy/codacy-tslint&utm_campaign=Badge_Grade)
[![Codacy Badge](https://api.codacy.com/project/badge/Coverage/65d66b1b6f134ef6b7225d2b66a8987d)](https://www.codacy.com/app/Codacy/codacy-tslint?utm_source=github.com&utm_medium=referral&utm_content=codacy/codacy-tslint&utm_campaign=Badge_Coverage)
[![CircleCI](https://circleci.com/gh/codacy/codacy-tslint.svg?style=svg)](https://circleci.com/gh/codacy/codacy-tslint)
[![Docker Version](https://images.microbadger.com/badges/version/codacy/codacy-tslint.svg)](https://microbadger.com/images/codacy/codacy-tslint "Get your own version badge on microbadger.com")

Docker engine to allow Codacy to have [TSLint](https://github.com/palantir/tslint) support.

## Usage

You can create the docker by doing:

```sh
yarn run docker
```

Run the docker with the following command:

```sh
docker run -it -v $srcDir:/src  <DOCKER_NAME>:<DOCKER_VERSION>
```

## Docs

[Tool Developer Guide](https://support.codacy.com/hc/en-us/articles/207994725-Tool-Developer-Guide)

## Test

We use the [codacy-plugins-test](https://github.com/codacy/codacy-plugins-test) to test our external tools integration.
You can follow the instructions there to make sure your tool is working as expected.

## Generate Docs

```sh
yarn run docs:gen
```

## What is Codacy

[Codacy](https://www.codacy.com/) is an Automated Code Review Tool
that monitors your technical debt, helps you improve your code quality,
teaches best practices to your developers,
and helps you save time in Code Reviews.

### Among Codacy's features

-   Identify new Static Analysis issues
-   Commit and Pull Request Analysis with GitHub, Bitbucket/Stash, Gitlab
-   Auto-comments on Commits and Pull Requests
-   Integration with Slack, HipChat, Jira, YouTrack
-   Track issues in Code Style, Security, Error Proneness, Performance, Unused Code and other categories

Codacy also helps keep track of Code Coverage, Code Duplication,
and Code Complexity.

Codacy supports PHP, Python, Ruby, Java, JavaScript, and Scala, among others.

### Free for Open Source

Codacy is free for Open Source projects.
