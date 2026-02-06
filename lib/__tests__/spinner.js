import { __, spinner } from '../spinner.js';

describe('spinner', () => {
  describe('with no max', () => {
    let actual;
    beforeEach(async () => {
      captureOutput(() => {
        actual = spinner();
      });
    });
    afterEach(() => {
      captureOutput(() => {
        actual.success();
      });
    });
    it('should return an object with various methods', () => {
      expect(actual).toHaveProperty('spinner');
      expect(actual).toHaveProperty('tick');
      expect(actual).toHaveProperty('success');
      expect(actual).toHaveProperty('failure');
      expect(actual).toHaveProperty('info');
    });
    it('should be chainable', () => {
      captureOutput(() => {
        const chainedActual = actual.tick();
        expect(chainedActual).toBe(actual);
      });
    });
    it('should change the spinner text on tick', () => {
      captureOutput(() => {
        actual.tick('new text');
        expect(actual.spinner).toHaveProperty('text', 'new text');
      });
    });
    it('should succeed', () => {
      vi.spyOn(__, 'greenify').mockReturnValue();

      captureOutput(() => {
        actual.success('yay');
        expect(__.greenify).toHaveBeenCalledWith('yay');
      });
    });
    it('should fail', () => {
      vi.spyOn(__, 'redify').mockReturnValue();

      captureOutput(() => {
        actual.failure('nay');
        expect(__.redify).toHaveBeenCalledWith('nay');
      });
    });
    it('should inform', () => {
      vi.spyOn(__, 'blueify').mockReturnValue();

      captureOutput(() => {
        actual.info('meh');
        expect(__.blueify).toHaveBeenCalledWith('meh');
      });
    });
  });
  describe('with a max', () => {
    let actual;
    beforeEach(async () => {
      captureOutput(() => {
        actual = spinner(3);
      });
    });
    afterEach(() => {
      captureOutput(() => {
        actual.success();
      });
    });
    it('should prepend the count when a max is set', () => {
      captureOutput(() => {
        actual.tick('step one');
      });
      expect(actual.spinner).toHaveProperty('text', '[1/3] step one');
    });
  });
});
