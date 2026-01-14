import { firostError } from '../firostError.js';

/**
 * Dynamically imports a specific module from the @inquirer/prompts package
 * @param {string} moduleName - The name of the module to import from @inquirer/prompts
 * @returns {Promise<any>} A promise that resolves to the imported module
 *
 * Note: We can't statically import inquirer as it creates an event listener
 * automatically on import, and we want to do that only when we need it (or is
 * will exceed the MaxListenersExceededWarning just because we imported firost)
 */
export async function importFromInquirer(moduleName) {
  const importedInquirer = await import('@inquirer/prompts');
  return importedInquirer[moduleName];
}

/**
 * Captures Ctrl-C input to abort a prompt method with custom error handling
 * @param {object} arg - Configuration object containing method, input, error, and options
 * @param {Function} arg.method - The async method to execute that can be aborted
 * @param {*} arg.input - Input data to pass to the method
 * @param {object} arg.error - Error configuration with code and message properties
 * @param {object} [arg.options] - Additional options to pass to the method
 * @returns {Promise<*>} The response from the executed method
 */
export async function captureCtrlC(arg) {
  const { method, input, error } = arg;

  const controller = new AbortController();
  const options = {
    ...arg.options,
    signal: controller.signal,
  };
  const stdin = options.input || process.stdin;

  // We catch Ctrl-C, to stop the prompt with a custom error
  const ctrlCKey = '';
  const cancelPromptOnCtrlC = (key) => {
    if (key == ctrlCKey) {
      stdin.off('data', cancelPromptOnCtrlC);
      controller.abort();
    }
  };
  stdin.on('data', cancelPromptOnCtrlC);

  try {
    const response = await method(input, options);
    stdin.off('data', cancelPromptOnCtrlC);
    return response;
  } catch (err) {
    if (err.name == 'AbortPromptError') {
      throw firostError(error.code, error.message);
    }
    throw err;
  }
}
