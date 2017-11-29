const given = require('./given');

let count = 1;

describe('given', () => {
  // eslint-disable-next-line no-return-assign
  given('one', () => (count += 1));

  it('first', () => {
    given('first', () => 'foo');

    expect(given.one).toBe(2);
    expect(given.one).toBe(2);
    expect(given.first).toBe('foo');
  });

  it('second', () => {
    given('second', () => 'bar');

    expect(given.one).toBe(3);
    expect(given.second).toBe('bar');
  });
});
