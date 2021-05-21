const current = require('../prompt');

describe('prompt', () => {
  describe('Normal usage', () => {
    let mockRun = jest.fn();
    beforeEach(() => {
      jest.spyOn(current, '__inquirerUI').mockReturnValue({
        run: mockRun.mockResolvedValue(),
      });
      jest.spyOn(current, '__inquirerReadline').mockReturnValue({
        on: jest.fn(),
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

      expect(actual).toEqual('Mellon');
    });
  });
  describe('CTRL-C', () => {
    beforeEach(async () => {
      jest.spyOn(current, '__addEmptyLine').mockReturnValue();
    });
    it('should reject on CTRL-C with a FIROST_PROMPT_CTRL_C error', async () => {
      const actual = current('Question?').catch((result) => {
        /* eslint-disable jest/no-conditional-expect */
        // We shouldn't normally have a conditional expect, in a catch, but here
        // it seems the only way to deal with the asynchrous call to the cancel
        expect(result).toHaveProperty('code', 'FIROST_PROMPT_CTRL_C');
        /* eslint-enable jest/no-conditional-expect */
      });
      current.__readline.emit('SIGINT');
      return actual;
    });
  });
});
