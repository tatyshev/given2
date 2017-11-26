const Container = require('./container');

let it = false;

const given = Container((next) => {
  if (it) next();
  else beforeEach(() => next());
});

beforeEach(() => { it = true; });
afterEach(() => { it = false; given.__clear__(); });

module.exports = given;
