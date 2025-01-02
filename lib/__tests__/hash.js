import current from '../hash.js';

describe('hash', () => {
  it('should return a 10 characters long string', () => {
    const actual = current('Lorem ipsum');

    expect(actual).toBeString();


    expect(actual).toHaveLength(10);
  });
  it('should return the same hash for same input', () => {
    const input = 'Lorem ipsum'
    console.info(current(input));
    expect(current(input)).toEqual(current(input));

  });
  it('should return different hash for different input', () => {
    const inputA = 'Lorem ipsum'
    const inputB = 'Dolor sit amet'
    expect(current(inputA)).not.toEqual(current(inputB));
  });
});
