import colors from 'yoctocolors';

/**
 * Write a warning log message
 * @param {string} text Text to display
 **/
export function consoleWarn(text) {
  console.info(colors.yellow('⚠'), text);
}
