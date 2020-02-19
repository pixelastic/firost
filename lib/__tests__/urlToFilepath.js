const module = jestImport('../urlToFilepath');

describe('urlToFilepath', () => {
  it('http://www.example.com/index.html', () => {
    const input = 'http://www.example.com/index.html';
    const expected = 'http/www.example.com/index.html';

    const actual = module(input);

    expect(actual).toEqual(expected);
  });
  it('https://www.example.com/index.html', () => {
    const input = 'https://www.example.com/index.html';
    const expected = 'https/www.example.com/index.html';

    const actual = module(input);

    expect(actual).toEqual(expected);
  });
  it('https://www.example.com/subpath/index.html', () => {
    const input = 'https://www.example.com/subpath/index.html';
    const expected = 'https/www.example.com/subpath/index.html';

    const actual = module(input);

    expect(actual).toEqual(expected);
  });
  it('https://www.example.com/subpath/index.html#foo', () => {
    const input = 'https://www.example.com/subpath/index.html#foo';
    const expected = 'https/www.example.com/subpath/index.html';

    const actual = module(input);

    expect(actual).toEqual(expected);
  });
  it('https://www.example.com/subpath/index.html?foo=bar', () => {
    const input = 'https://www.example.com/subpath/index.html?foo=bar';
    const expected = 'https/www.example.com/subpath/index_foo-bar.html';

    const actual = module(input);

    expect(actual).toEqual(expected);
  });
  it('https://www.example.com/subpath/index.html?foo=bar&bar=baz', () => {
    const input = 'https://www.example.com/subpath/index.html?foo=bar&bar=baz';
    const expected = 'https/www.example.com/subpath/index_bar-baz_foo-bar.html';

    const actual = module(input);

    expect(actual).toEqual(expected);
  });
  it('https://www.example.com/subpath/index.html?bar=baz&foo=bar', () => {
    const input = 'https://www.example.com/subpath/index.html?bar=baz&foo=bar';
    const expected = 'https/www.example.com/subpath/index_bar-baz_foo-bar.html';

    const actual = module(input);

    expect(actual).toEqual(expected);
  });
  describe('with custom extension', () => {
    it('http://www.example.com/foo', () => {
      const input = 'http://www.example.com/foo';
      const options = { extension: 'json' };
      const expected = 'http/www.example.com/foo.json';

      const actual = module(input, options);

      expect(actual).toEqual(expected);
    });
    it('http://www.example.com/foo.html', () => {
      const input = 'http://www.example.com/foo.html';
      const options = { extension: 'json' };
      const expected = 'http/www.example.com/foo.json';

      const actual = module(input, options);

      expect(actual).toEqual(expected);
    });
    it('http://www.example.com/foo?bar=baz', () => {
      const input = 'http://www.example.com/foo?bar=baz';
      const options = { extension: 'json' };
      const expected = 'http/www.example.com/foo_bar-baz.json';

      const actual = module(input, options);

      expect(actual).toEqual(expected);
    });
    it('http://www.example.com/foo.html?bar=baz', () => {
      const input = 'http://www.example.com/foo.html?bar=baz';
      const options = { extension: 'json' };
      const expected = 'http/www.example.com/foo_bar-baz.json';

      const actual = module(input, options);

      expect(actual).toEqual(expected);
    });
  });
});
