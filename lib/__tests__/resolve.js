import path from 'node:path';
import fs from 'fs-extra';
import { uuid } from '../uuid.js';
import { dirname } from '../dirname.js';
// We do not use _resolve, as we are testing it from userland, but we need to
// include it for vitest to reload the tests whenever the source is updated
import { resolve as _resolve } from '../resolve.js';

const testCases = [
  ['/tmp/one', ['/tmp/one']],
  ['/tmp/one/../two', ['/tmp/two']],
  ['./two.js', ['{dirname}/two.js']],
  [['/tmp/one/../two'], ['/tmp/two']],
  [['<gitRoot>/one'], ['{gitRoot}/one']],
  [['<packageRoot>/two'], ['{packageRoot}/two']],
  [['<cwd>/three'], ['{cwd}/three']],
  [
    ['/tmp/one', '/tmp/two'],
    ['/tmp/one', '/tmp/two'],
  ],
  [
    ['<packageRoot>/one', '<cwd>/two'],
    ['{packageRoot}/one', '{cwd}/two'],
  ],
  [
    ['/tmp/one', './two.js', '<gitRoot>/three'],
    ['/tmp/one', '{dirname}/two.js', '{gitRoot}/three'],
  ],
];

describe('resolve', async () => {
  await cleanUp();
  const testCasesOutput = await getUserlandResults();

  // This will compare the results we ran from a real file in userland against
  // the expected results
  it.each(testCasesOutput)('$input', async (results) => {
    const { actual, expected } = results;
    expect(actual).toEqual(expected);
  });

  afterAll(async () => {
    await cleanUp();
  });
});

const userlandGitRoot = '/tmp/firost/resolve';
const userlandPackageRoot = `${userlandGitRoot}/module`;
const userlandPath = `${userlandPackageRoot}/lib/${uuid()}.js`;
/**
 * As resolve() internally uses absolute() which resolves filepaths relative to
 * the called script, we need to simulate calling it from outside firost.
 * This method will create a fake script, save it in /tmp, run it and gather the
 * results of the testCases
 * @returns {object} testCasesResult on which we can iterate to compare
 */
async function getUserlandResults() {
  const moduleLibFilepath = `${dirname()}/..`;
  const moduleFirostImportFilepath = `${moduleLibFilepath}/firostImport.js`;
  const moduleResolveFilepath = `${moduleLibFilepath}/resolve.js`;
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
          const { resolve } = await firostImport('${moduleResolveFilepath}', { forceReload: true });
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
            cwd: process.cwd(),
            packageRoot: packageRoot(),
            gitRoot: gitRoot(),
          }

          return testCases.map((testCase) => {
            const input = testCase[0];
            let expected = testCase[1];

            // Replace any {special} template with the corresponding value in each array element
            expected = expected.map((expectedPath) => {
              let result = expectedPath;
              if (result.includes('{')) {
                for (let key in special) {
                  const value = special[key];
                  result = result.replace('{' + key + '}', value)
                }
              }
              return result;
            });

            const actual = resolve(input);
            return {
              input,
              actual,
              expected,
            }
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
      name: 'firost-resolve-userland',
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
