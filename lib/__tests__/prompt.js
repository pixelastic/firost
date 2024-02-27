import current from '../prompt.js';

describe('prompt', () => {
  describe('Normal usage', () => {
    let mockRun = vi.fn();
    beforeEach(() => {
      vi.spyOn(current, '__inquirerUI').mockReturnValue({
        run: mockRun.mockResolvedValue(),
      });
      vi.spyOn(current, '__inquirerReadline').mockReturnValue({
        on: vi.fn(),
      });
    });
    it('should ask the given question', async () => {
      await current('Question?');

      expect(mockRun).toHaveBeenCalledWith([
        { name: 'answer', message: 'Question?' },
      ]);
    });
    it('should return the answer key', async () => {
      mockRun.mockResolvedValue({ answer: 'Mellon' });

      const actual = await current('Question?');

      expect(actual).toBe('Mellon');
    });
  });
  describe('CTRL-C', () => {
    beforeEach(async () => {
      vi.spyOn(current, '__addEmptyLine').mockReturnValue();
    });
    it('should reject on CTRL-C with a FIROST_PROMPT_CTRL_C error', async () => {
      const actual = current('Question?').catch((result) => {
        /* eslint-disable vitest/no-conditional-expect */
        // We shouldn't normally have a conditional expect, in a catch, but here
        // it seems the only way to deal with the asynchrous call to the cancel
        expect(result).toHaveProperty('code', 'FIROST_PROMPT_CTRL_C');
        /* eslint-enable vitest/no-conditional-expect */
      });
      current.__readline.emit('SIGINT');
      return actual;
    });
  });
});
