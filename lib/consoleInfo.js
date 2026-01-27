import colors from 'yoctocolors';

/**
 * Write an information log message
 * @param {string} text Text to display
 **/
export function consoleInfo(text) {
  console.info(colors.blue('•'), text);
}
