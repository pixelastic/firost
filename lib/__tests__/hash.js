import { hash } from '../hash.js';

describe('hash', () => {
  it('should return a 10 characters long string', () => {
    const actual = hash('Lorem ipsum');

    expect(actual).toBeString();
    expect(actual).toHaveLength(10);
  });
  it('should return the same hash for same input', () => {
    const input = 'Lorem ipsum';
    expect(hash(input)).toEqual(hash(input));
  });
  it('should return different hash for different input', () => {
    const inputA = 'Lorem ipsum';
    const inputB = 'Dolor sit amet';
    expect(hash(inputA)).not.toEqual(hash(inputB));
  });
});
