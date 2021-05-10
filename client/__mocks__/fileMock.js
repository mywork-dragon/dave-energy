// For Jest tests, sometimes a component being testing, whether itself or a
// child component down the DOM tree, will import a file. The
// "moduleNameWrapper" property in ../jest.config.js will tell the test runner
// to resolve file imports to this module so that it can compile

module.exports = 'test-file-stub';
