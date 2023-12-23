# Avispa ECM Client Frontend

## General details

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

In the `scripts` section of `package.json` file there are four scripts defined. Three of them, required to day-to-day
work on the project are explained below.

`build` script has additionally added `GENERATE_SOURCEMAP=false` parameter to hide details about files structure in
the browser debugger on production.

By default, development mode will use `.env.development` environment variables and production mode will
use `.env.production`. It is however possible to change this behavior or even create two separate scripts for building
production build with dev or prod variables:

```json
"build": "NODE_ENV=development react-scripts build",
"build:prod": "NODE_ENV=production react-scripts build",
```

### Development mode

To run project in the development mode run below command in the root directory. It is accessible
using [http://localhost:3000](http://localhost:3000)

`npm start`

### Running tests

To launch test runner in the interactive launch mode, run below command.

`npm test`

### Production mode

To build the app for production to the `build` folder use below command. It correctly bundles React in production mode
and optimizes the build for the best performance including files minification and hashes in the filenames.

`npm run build`

## Additional installation details

Typically, to install any new package use `install` command and to uninstall use `uninstall`.

`npm install <package_name>[@<version>]`

`npm uninstall <package_name>`

### Node.js upgrade

To upgrade Node.js on Windows go to the [official website](https://nodejs.org/en/download/current), download and unzip
the right package. Then update `Path` or `PATH` environment variable with the path leading to the unzipped package.

### `npm` upgrade

To upgrade `npm` run below command.

`npm install npm@<version>`

Version can be later check with `npm --version`
