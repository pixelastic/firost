import { dirname } from '../dirname.js';
import { gitRoot } from '../gitRoot/index.js';

/**
 * We cannot use absolute('<gitRoot>') from inside of firost tests, as this
 * returns the closest git root in userland, we created this helper to get us
 * the actual root of firost
 **/
export default gitRoot(dirname());
