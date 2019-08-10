/* global given */
/* eslint-disable no-debugger */

describe('given', () => {
  given('count', () => 1);
  // eslint-disable-next-line no-return-assign
  given('one', () => (given.count += 1));

  it('first', () => {
    given('first', () => 'foo');

    expect(given.one).toBe(2);
    expect(given.one).toBe(2);
    expect(given.first).toBe('foo');
  });

  it('second', () => {
    given('count', () => 2);
    given('second', () => 'bar');

    expect(given.one).toBe(3);
    expect(given.second).toBe('bar');
  });
});
