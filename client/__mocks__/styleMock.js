// For Jest tests, sometimes a component being testing, whether itself or a
// child component down the DOM tree, will import css. The "moduleNameWrapper"
// property in ../jest.config.js will tell the test runner to resolve css
// imports to this module so that it can compile

module.exports = {};
