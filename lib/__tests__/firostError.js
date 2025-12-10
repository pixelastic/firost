import { firostError } from '../firostError.js';

describe('error', () => {
  it('should return an error with both message and code', async () => {
    const actual = firostError('MY_MODULE_ERROR', 'This does not work');

    expect(actual instanceof Error).toBe(true);
    expect(actual).toHaveProperty('code', 'MY_MODULE_ERROR');
    expect(actual).toHaveProperty(
      'message',
      'MY_MODULE_ERROR:\nThis does not work',
    );
  });
});
