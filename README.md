<h1 align="center">Given2</h1>

<p align="center">
  <a href="https://www.npmjs.com/package/given2">
    <img src="https://img.shields.io/npm/v/given2.svg"/>
  </a>

  <a href="https://www.npmjs.com/package/given2">
    <img src="https://img.shields.io/npm/dm/given2.svg"/>
  </a>

  <img src="https://travis-ci.org/tatyshev/given2.svg?branch=v2"/>
</p>

<p align="center">
  <code>Yet another way to make the process of testing in JavaScript better.</code>
</p>

<p align="center">
  <img src="https://github.com//tatyshev/given2/blob/v2/static/example.png?raw=true"/>
</p>

> Currently `given2` supports only `jasmine`, `mocha` and `jest`.

Basically the given helper will register a beforeEach and a afterEach hook that will create a memoized get accessor with the given name. The value will be cached across multiple test suits in the same example but not across examples.

Note that `given` variables is lazy-evaluated: data in the variables are not calculated until they are accessed for the first time.

## Installation

You can install given2 using `npm` or `yarn`

```
npm install given2
yarn add given2
```

## Usage

To use given you just need to require or import the `given2` module in your spec files

```js
import given from 'given2'

describe('Example', () => {
  given('foo', () => 'bar');

  it('foo should be "bar"', () => {
    expect(given.foo).toBe('bar');
  })
})
```

## More examples

The `given2` variables are evaluated only once and are cached within a single test suite, and reset the cache after each suite.

```js
let count = 0;

describe('given', () => {
  given('count', () => count += 1);

  // The values cached in same examples
  it('memoizes the value', () => {
    expect(given.count).toBe(1);
    expect(given.count).toBe(1);
  });

  // But do not cached across examples
  it('is not cached across examples', () => {
    expect(given.count).toBe(2);
  });
});
```

The values must be functions otherwise you will get an error.

```js
describe('given', () => {
  it('should throw error', () => {
    // Such use will cause an error
    expect(() => given('value', 123)).toThrow();
  });
});
```

When you try to use the variable given, recursively `given2` tells you about it.

```js
describe('given', () => {
  // Such use will cause an error
  given('one', () => given.one);

  it('should throw error', () => {
    expect(() => given.one).toThrow();
  });
});
```

If you want the variable values not to be cached, use `@` prefix. All variables that begin with this prefix will not be cached.

```js
describe('given', () => {
  given('@random', () => Math.random());

  it('should not cache', () => {
    const cached = given.random;

    // values not cached
    expect(given.random).not.toBe(cached);
    expect(given.random).not.toBe(cached);
  });
});
```

Also you can get the values of the variables immediately, right after the declaration, with the prefix '!'

```js
describe('given', () => {
  given('!invoice', () => {
    const invoice = Invoice.create({ price: 5 })
    invoice.paid(3)
    return invoice;
  });

  given('status', () => given.invoice);

  it('should be "paid"', () => {
    expect(given.status).toBe("paid");
  });
});
```



