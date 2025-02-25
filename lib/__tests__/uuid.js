import { uuid } from '../uuid.js';

describe('uuid', () => {
  it('should return a 21 characters long string', () => {
    const actual = uuid();

    expect(actual).toBeString();
    expect(actual).toHaveLength(21);
  });
  it('should return different values each time', () => {
    expect(uuid()).not.toEqual(uuid());
  });
});
