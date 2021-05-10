# David Energy Client

## Setup Environment

`package.json` sets Node engine to v12.16.2 and will throw an error if attempted to run with a different version. Use [nvm](https://github.com/nvm-sh/nvm) to manage local versions of Node.

1. Install nvm

```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
```

2. Load nvm on new terminal instances

Add the following line in `~/.bash_profile` or equivalent,

```
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
```

Load the file,

`source ~/.bash_profile`

3. Check if loads

```
nvm
```

4. Install project's required Node version

```
nvm install 12.16.2
```

5. Default nvm to load 12.16.2

```
nvm alias default 12.16.2
```

## Install dependencies

```

brew install yarn

```

## Develop locally

Watch for file changes and rebuild the bundle. Requires the flask app to serve the client code.

```

$ cd client
$ yarn install
$ yarn dev

```

In another terminal if you have the server running(Look into Readme under /dave-energy for the command), you can then load the site
locally in your browser,

http://localhost:5000/control-room

## Testing

`$ yarn test`

Watch tests

`$ yarn test:watch`

Unit tests are written in [jest](https://jestjs.io) and [react-testing-library](https://testing-library.com/). Test files are named like `/.*.test.tsx?/`, otherwise it will not be included in the test runner. react-testing-library is preferred over [enzyme](https://enzymejs.github.io/enzyme/) because the tests resemble the way the software is used on the client. See `./src/components/History.test.tsx` for a full example that includes:

1. An endpoint is mocked to resemble data that would be consumed in the redux store
2. The React component consumes the data from the store and renders appropriately
3. A button is pressed to re-render and subsequently assertions are run on the redrawn UI

## Deploy to staging (Heroku)

Deploy by merging your code to branch `origin/master` preferably by pull request. Heroku will look for `package.json` in the root directory (not `./client/package.json`) and execute `npm run build`.

## API Serialization

When sending an API request to the server, query and body parameter keys are converted from camel to snake case ie `camelCase` --> `snake_case`. Conversely, when receiving an API response from the server, the keys are converted from snake to camel case ie `snake_case` --> `camelCase`. This is because the client JS uses camel case and the Python server uses snake case by convention.

## Architecture Design

The application consumes server data and uses several Redux stores to manage holistic state. These terms will help break down the flow of data.

1. Receive a JSON response as a `Document` from an API call
2. Construct a `Model` from the `Document` for application consumption
3. Update the `Redux Store State` instance with the `Model`
4. Map the `Redux Store State` to React component props

### Document

A TS interface that represents the camel case JSON response (converted from snake case) that is returned from an API call. These are defined in `src/models`. All fields should be optional (`undefined`) as denoted by the question mark in `{ id?: string | null }` and its type should be its expected type or `null`.

### Model

A JS class definition that represents the `Document` it is constructed from along with helper methods. These are defined in `src/models`. The model instance fields should represent the `Document` with `undefined` fields being initialized to `null` instead. A model field can be reference to another model instance. These are considered ready to be consumed by the application after being constructed by a `Document`.

### Redux Store State

The state object that represents the application state. A field in the store should never reference a `Document` but may contain references to a `Model`. It may include fields such as `loading` - to denote if the API call is still in flight and has not yet returned a response, or `error` - to denote the error response from the API. A React component may map the state to props for consumption. For example, mapping the store state's `loading` field to a React component prop to show/hide a loading indicator for an API call in flight.
