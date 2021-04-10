global.testUrl = 'https://pxugho43ie.execute-api.eu-west-1.amazonaws.com' || process.env.TEST_URL;

const arrayFunctions = require('./src/array-functions');
const apiFunctions = require('./src/api-wrapper');

module.exports = {
  ...arrayFunctions,
  ...apiFunctions
}