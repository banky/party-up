![Continuous Deployment](https://github.com/bankya/party-up/workflows/Continuous%20Deployment/badge.svg)
![Continuous Integration](https://github.com/bankya/party-up/workflows/Continuous%20Integration/badge.svg)

# Party Up

An app that lets users listen to music together no matter what music platform they use. Automatic deployments set to https://gopartyup.web.app. 

## Setup

```bash
brew install yarn # Or another command on your OS
yarn install
```

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode. Tests are not run against the production database, instead they point to a local instance of firebase called the firebase emulator. So before running tests, start the emulator 

```bash
yarn firebase emulators:start
```
Then you can run 
```bash
yarn test
```

See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed! A Github action currently builds and deploys to production

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
