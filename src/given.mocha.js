/* eslint import/no-extraneous-dependencies: 0 */

const given = require('./given');
const { expect } = require('chai');

let count = 1;

describe('given', () => {
  // eslint-disable-next-line no-return-assign
  given('one', () => (count += 1));

  it('first', () => {
    given('first', () => 'foo');

    expect(given.one).to.equal(2);
    expect(given.one).to.equal(2);
    expect(given.first).to.equal('foo');
  });

  it('second', () => {
    given('second', () => 'bar');

    expect(given.one).to.equal(3);
    expect(given.second).to.equal('bar');
  });
});
