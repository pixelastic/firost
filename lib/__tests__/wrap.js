import { wrap } from '../wrap.js';

describe('wrap', () => {
  let __ = {};
  beforeEach(async () => {
    __ = {
      getName() {
        return 'firost';
      },
      greetings() {
        const name = __.getName();
        return `Hello, ${name}`;
      },
      async asyncGetName() {
        return 'firost';
      },
      async asyncGreetings() {
        const name = await __.asyncGetName();
        return `Hello, ${name}`;
      },
    };
  });
  it('should call the inner method transparently', () => {
    const wrappedMethod = wrap(__, 'greetings');
    const actual = wrappedMethod();

    expect(actual).toEqual('Hello, firost');
  });
  it('should allow mocking the inner method after wrapping', () => {
    const wrappedMethod = wrap(__, 'getName');
    expect(wrappedMethod()).toEqual('firost');

    __.getName = function () {
      return 'updated name';
    };
    expect(wrappedMethod()).toEqual('updated name');
  });
  it('should allow mocking a linked inner method after wrapping', () => {
    const wrappedMethod = wrap(__, 'greetings');
    expect(wrappedMethod()).toEqual('Hello, firost');

    __.getName = function () {
      return 'new name';
    };
    expect(wrappedMethod()).toEqual('Hello, new name');
  });
  it('should allow mocking "internal" async methods', async () => {
    const wrappedMethod = wrap(__, 'asyncGreetings');
    expect(await wrappedMethod()).toEqual('Hello, firost');

    __.asyncGetName = async function () {
      return 'new name';
    };
    expect(await wrappedMethod()).toEqual('Hello, new name');
  });
  it('should throw an error if the specified key is not a function', () => {
    __.notAFunction = 'just a string';

    let actual = null;
    try {
      wrap(__, 'notAFunction');
    } catch (err) {
      actual = err;
    }

    expect(actual).toHaveProperty('code', 'FIROST_WRAP_NOT_A_FUNCTION');
  });
});
