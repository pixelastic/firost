import callsites from 'callsites';
/**
 * Return the full path to the file calling here();
 * @returns {string} Absolute filepath to the calling script
 **/
export default function () {
  return callsites()[1].getFileName();
}
