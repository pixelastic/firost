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
      // Start a pending prompt..
      const actual = current('Question?').catch((result) => {
        expect(result).toHaveProperty('code', 'FIROST_PROMPT_CTRL_C');
      });
      // ...and send a SIGINT signal to it
      current.__readline.emit('SIGINT');

      return actual;
    });
  });
});
