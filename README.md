# NestJS Mono repo starter

![CI](https://github.com/scopsy/nestjs-monorepo-starter/workflows/CI/badge.svg)

This is a monorepo boilerplate to quickly start nestjs projects, this start includes an api, client and shared libraries.

- [Overview](#overview)
  - [What's inside](#whats-inside)
- [Tweaking for your project](#tweaking-for-your-project)
- [Referencing packages from other packages/apps](#referencing-packages-from-other-packagesapps)
- [Installing](#installing)
- [Development](#development)
- [Package Management](#package-management)
    - [Installing a module from Yarn](#installing-a-module-from-yarn)
    - [Uninstalling a module from a package](#uninstalling-a-module-from-a-package)
- [Package Versioning and TS Paths](#package-versioning-and-ts-paths)
- [Docker image](#docker-image)
- [Running the tests](#running-the-tests)
- [Inspiration](#inspiration)

## Overview

The repository is powered by [Lerna](https://github.com/lerna/lerna) and [Yarn](https://yarnpkg.com/en/).
Lerna is responsible for bootstrapping, installing, symlinking all of the packages/apps together.

### What's inside

This repo includes multiple packages and applications for a hypothetical project called `nest-starter`. Here's a rundown of the components:

- `shared`: Shared utilities between server and client (TypeScript)
- `core`: Shared utilities between servers
- `client`: Angular app (depends on `shared`)
- `api`: NestJS Api server (depends on `shared` + `core`)
- `landing`: A static landing page

## Tweaking for your project

You should run a search and replace on the word `nest-starter` and replace with your project name.

## TypeScript

### Referencing packages from other packages/apps

Each package can be referenced within other packages/app files by importing from `@<name>/<folder>` (kind of like an npm scoped package).

```tsx
import * as React from 'react';
import { Button } from '@nest-starter/shared';

class App extends React.Component<any> {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <Button>Hello</Button>
        <p className="App-intro">
          To get started, edit <code>src/App.tsx</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
```

**IMPORTANT: YOU DO NOT NEED TO CREATE/OWN THE NPM ORGANIZATION OF YOUR PROJECT NAME BECAUSE NOTHING IS EVER PUBLISHED TO NPM.**

For more info, see the section on [package versioning](#package-versioning-and-ts-paths)

### Installing

Install lerna globally.

```
npm i -g lerna
```

```
git clone git@github.com:scopsy/nestjs-monorepo-starter.git
cd typescript-monorepo-starter
rm -rf .git
lerna bootstrap
```

### Development

Lerna allows some pretty nifty development stuff. Here's a quick rundown of stuff you can do:

- _`yarn start`_: Run's the `yarn start` command in every project and pipe output to the console. This will do the following:
  - api: Starts the api in dev mode on port 3000
  - client: Starts the app in dev mode on port 4200
  - shared: Starts TypeScript watch task
  - core: Starts TypeScript watch task
- _`yarn build`_: Build all projects
- _`lerna clean`_: Clean up all node_modules
- _`lerna bootstrap`_: Rerun lerna's bootstrap command

### Package Management

\*\*IF you run `yarn add <module>` or `npm install <module>` from inside a project folder, you will break your symlinks.\*\* To manage package modules, please refer to the following instructions:

#### Installing a module from Yarn

To add a new npm module to ALL packages, run

```bash
lerna add <module>
```

To add a new npm module(s) to just one package

```bash
lerna add <module> --scope=<package-name> <other yarn-flags>

# Examples (if your project name was `nest-starter`)
lerna add classnames --scope=@nest-starter/api
lerna add @types/classnames @types/jest --scope=@nest-starter/api --dev
```

#### Uninstalling a module from a package

Unfortunately, there is no `lerna remove` or `lerna uninstall` command. Instead, you should remove the target module from the relevant package or packages' `package.json` and then run `lerna bootstrap` again.
Reference issue: https://github.com/lerna/lerna/issues/1229#issuecomment-359508643

### Package Versioning and TS Paths

None of the packages in this setup are _ever_ published to NPM. Instead, each shared packages' (like `shared` and `core`) have build steps (which are run via `yarn prepare`) and get built locally and then symlinked. This symlinking solves some problems often faced with monorepos:

- All projects/apps are always on the latest version of other packages in the monorepo
- You don't actually need to version things (unless you actually want to publish to NPM)
- You don't need to do special stuff in the CI or Cloud to work with private NPM packages

This project works great with WebStorm when opened from the root, this means all imports, Go to should work correctly when navigating between packages.
You are welcome.

### Docker image

Build the docker image:

```shell
docker build -t api -f Docker.api .
```

Run the Docker Container:

```shell
docker run -p 3000:3000 api
```

## Inspiration
A LOT of this has been shameless taken from [palmerhq/monorepo-starter](https://github.com/palmerhq/monorepo-starter).
