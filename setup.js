/* eslint-disable no-undef */

const given = require('./src/given');

if (typeof global !== 'undefined') {
  global.given = given;
}

if (typeof window !== 'undefined') {
  window.given = given;
}
