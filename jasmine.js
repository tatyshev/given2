const root = require('window-or-global');
const Given = require('./given');

let it = false;

const given = new Given((define) => {
  if (it) define();
  else beforeEach(() => define());
});

beforeEach(() => { it = true; });
afterEach(() => { it = false; given.__clear__(); });

root.given = given;
module.exports = given;
