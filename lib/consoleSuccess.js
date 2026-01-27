import colors from 'yoctocolors';

/**
 * Write a success log message
 * @param {string} text Text to display
 **/
export function consoleSuccess(text) {
  console.info(colors.green('✔'), text);
}
