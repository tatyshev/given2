const root = require('window-or-global');
const Given = require('./given');

const given = new Given((define) => {
  try {
    expect(null);
    define();
  } catch (e) {
    beforeEach(() => define());
  }
});

afterEach(() => { given.__clear__(); });

root.given = given;
module.exports = given;
