import colors from 'yoctocolors';

/**
 * Write an error log message
 * @param {string} text Text to display
 **/
export function consoleError(text) {
  console.info(colors.red('✘'), text);
}
