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
    const wrappedMethod = wrap(__.greetings);
    const actual = wrappedMethod();

    expect(actual).toEqual('Hello, firost');
  });
  it('should allow mocking "internal" sync methods', () => {
    __.getName = function () {
      return 'new name';
    };

    const wrappedMethod = wrap(__.greetings);
    const actual = wrappedMethod();

    expect(actual).toEqual('Hello, new name');
  });
  it('should allow mocking "internal" async methods', async () => {
    __.asyncGetName = function () {
      return 'new name';
    };

    const wrappedMethod = wrap(__.asyncGreetings);
    const actual = await wrappedMethod();

    expect(actual).toEqual('Hello, new name');
  });
});
