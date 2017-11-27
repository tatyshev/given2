const Container = require('./container');

const before = (fn) => {
  if (typeof beforeEach === 'function') {
    beforeEach(fn);
  }
};

const after = (fn) => {
  if (typeof afterEach === 'function') {
    afterEach(fn);
  }
};

let it = false;

const given = Container((run) => {
  if (it) run();
  else before(() => run());
});

before(() => { it = true; });
after(() => { it = false; given.__clear__(); });

module.exports = given;
