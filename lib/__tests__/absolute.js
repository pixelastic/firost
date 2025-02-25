import path from 'node:path';
import fs from 'fs-extra';
import { uuid } from '../uuid.js';
import { dirname } from '../dirname.js';
// We do not use _absolute, as we are testing it from userland, but we need to
// include it for vitest to reload the tests whenever the source is updated
import { absolute as _absolute } from '../absolute.js';

const testCases = [
  // Empty
  [[], '{here}'],
  // Absolute
  [['/tmp/one'], '/tmp/one'],
  [['/tmp/one/../two'], '/tmp/two'],
  [['/tmp/one/./two'], '/tmp/one/two'],
  [['/tmp', 'one', './two'], '/tmp/one/two'],
  // Tilde
  [['~/one'], '{home}/one'],
  [['~/one/two/../three'], '{home}/one/three'],
  [['~/one/./two'], '{home}/one/two'],
  [['~', 'one', 'two', '..', 'three'], '{home}/one/three'],
  // Relative with ./
  [['./two.js'], '{dirname}/two.js'],
  [['./one/two/../three'], '{dirname}/one/three'],
  [['./one/./two'], '{dirname}/one/two'],
  [['./one', './two'], '{dirname}/one/two'],
  // Relative without prefix
  [['two.js'], '{dirname}/two.js'],
  // <cwd> prefix
  [['<cwd>/one'], '{cwd}/one'],
  [['<cwd>/one/two/../three'], '{cwd}/one/three'],
  [['<cwd>/one/./two'], '{cwd}/one/two'],
  [['<cwd>', 'one', '.', 'two'], '{cwd}/one/two'],
  // <packageRoot> prefix
  [['<packageRoot>/one'], '{packageRoot}/one'],
  [['<packageRoot>/one/two/../three'], '{packageRoot}/one/three'],
  [['<packageRoot>/one/./two'], '{packageRoot}/one/two'],
  [['<packageRoot>/one', './two'], '{packageRoot}/one/two'],
  // <gitRoot> prefix
  [['<gitRoot>/one'], '{gitRoot}/one'],
  [['<gitRoot>/one/two/../three'], '{gitRoot}/one/three'],
  [['<gitRoot>/one/./two'], '{gitRoot}/one/two'],
  [['<gitRoot>', './one/./two'], '{gitRoot}/one/two'],
];

describe('absolute', async () => {
  await cleanUp();
  const testCasesOutput = await getUserlandResults();

  // This will compare the results we ran from an real file in userland against
  // the expected results
  it.each(testCasesOutput)('%s => %s', async (input, _expected, results) => {
    const { actual, expected } = results;
    expect(actual).toEqual(expected);
  });

  afterAll(async () => {
    await cleanUp();
  });
});

const userlandGitRoot = '/tmp/firost/absolute';
const userlandPackageRoot = `${userlandGitRoot}/module`;
const userlandPath = `${userlandPackageRoot}/lib/${uuid()}.js`;
/**
 * As absolute() resolves filepath relatives to the called script, we need to
 * simulate calling it from outside firost.
 * This method will create a fake script, save it in /tmp, run it and gather the
 * results of the testCases
 * @returns {object} testCasesResult on which we can iterate to compare
 */
async function getUserlandResults() {
  const moduleLibFilepath = `${dirname()}/..`;
  const moduleFirostImportFilepath = `${moduleLibFilepath}/firostImport.js`;
  const moduleAbsoluteFilepath = `${moduleLibFilepath}/absolute.js`;
  const moduleHereFilepath = `${moduleLibFilepath}/here.js`;
  const moduleDirnameFilepath = `${moduleLibFilepath}/dirname.js`;
  const modulePackageRootFilepath = `${moduleLibFilepath}/packageRoot/index.js`;
  const moduleGitRootFilepath = `${moduleLibFilepath}/gitRoot/index.js`;

  const userlandTestCases = JSON.stringify(testCases);
  const userlandCode = dedent`
      import { firostImport } from 'file://${moduleFirostImportFilepath}';
      import os from 'os';

      export default {
        async run() {
          // Dynamic import of the dependencies, so they are updated when we
          // change them, without requiring restarting the whole test suite
          const { absolute } = await firostImport('${moduleAbsoluteFilepath}', { forceReload: true });
          const { here } = await firostImport('${moduleHereFilepath}', { forceReload: true });
          const { dirname } = await firostImport('${moduleDirnameFilepath}', { forceReload: true });
          const { packageRoot } = await firostImport('${modulePackageRootFilepath}', { forceReload: true });
          const { gitRoot } = await firostImport('${moduleGitRootFilepath}', { forceReload: true });

          const testCases = ${userlandTestCases};

          // Special mapping of paths relative to this userland script
          const special = {
            here: here(),
            dirname: dirname(),
            home: os.homedir(),
            cwd: process.cwd,
            packageRoot: packageRoot(),
            gitRoot: gitRoot(),
          }

          return testCases.map((testCase) => {
            const input = testCase[0];

            let expected = testCase[1];

            // Replace any {special} template with the corresponding value
            if (expected.includes('{')) {
              for (let key in special) {
                const value = special[key];
                expected = expected.replace('{' + key + '}', value)
              }
            }

            const actual = absolute(...input);
            return [input, expected, {
              input,
              actual,
              expected,
            }]
          });
        }
      }
    `;

  // Create gitRoot
  await fs.mkdirp(`${userlandGitRoot}/.git`);

  // Create packageRoot
  await fs.mkdirp(`${userlandPackageRoot}`);
  await fs.writeFile(
    `${userlandPackageRoot}/package.json`,
    JSON.stringify({
      private: true,
      type: 'module',
      name: 'firost-absolute-userland',
    }),
  );

  // Write script
  await fs.mkdirp(path.dirname(userlandPath));
  await fs.writeFile(userlandPath, userlandCode);

  // Import and load the file
  const userlandModule = await import(userlandPath);
  return await userlandModule.default.run();
}

/**
 * After each run, we remove the userland file we created.
 */
async function cleanUp() {
  await fs.emptyDir(userlandPackageRoot);
}
