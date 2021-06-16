const current = require('../isUrl');

describe('isUrl', () => {
  it.each([
    ['http://here.com', true],
    ['https://here.com', true],
    ['https://here.com/cover.png', true],
    ['https://here.com/cover with spaces.png', true],
    ['./cover.png', false],
    ['cover.png', false],
    ['/cover.png', false],
    ['http.png', false],
  ])('%s', async (input, expected) => {
    const actual = current(input);
    expect(actual).toEqual(expected);
  });
});
