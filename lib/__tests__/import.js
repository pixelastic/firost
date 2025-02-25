import path from 'node:path';
import { absolute } from '../absolute.js';
import { firostImport } from '../firostImport.js';
import { dirname } from '../dirname.js';
import { writeJson } from '../writeJson.js';
import { write } from '../write.js';
import { emptyDir } from '../emptyDir.js';
import { uuid } from '../uuid.js';
import firostRoot from '../test-helpers/firostRoot.js';

describe('import', () => {
  const tmpDir = absolute(firostRoot, '/tmp/import');
  beforeEach(async () => {
    await emptyDir(tmpDir);
  });
  it('should import a dependency by name', async () => {
    const actual = await firostImport('golgoth');
    expect(actual).toHaveProperty('chalk');
  });
  it('should import a local file by relative path', async () => {
    const id = uuid();
    const modulePath = absolute(`${tmpDir}/${id}.js`);

    await write(`export default '${id}';`, modulePath);

    const modulePathRelative = path.relative(dirname(), modulePath);
    const actual = await firostImport(modulePathRelative);
    expect(actual).toBe(id);
  });
  it('should import a local file by absolute path', async () => {
    const id = uuid();
    const modulePath = absolute(`${tmpDir}/${id}.js`);
    await write(`export default '${id}';`, modulePath);

    const actual = await firostImport(modulePath);
    expect(actual).toBe(id);
  });
  it('should import a local CommonJS file', async () => {
    const id = uuid();
    const modulePath = absolute(`${tmpDir}/${id}.js`);
    await write(`module.exports = '${id}'`, modulePath);

    const actual = await firostImport(modulePath);
    expect(actual).toBe(id);
  });
  it('should import a local .json file', async () => {
    const id = uuid();
    const modulePath = absolute(`${tmpDir}/${id}.json`);
    await writeJson({ content: id }, modulePath);

    const actual = await firostImport(modulePath);
    expect(actual).toHaveProperty('content', id);
  });
  describe('cache', () => {
    it('should use cached version by default', async () => {
      const id = uuid();
      const modulePath = absolute(`${tmpDir}/${id}.json`);
      await writeJson({ content: id }, modulePath);

      const firstRead = await firostImport(modulePath);

      await writeJson({ content: 'new-value' }, modulePath);
      const secondRead = await firostImport(modulePath);

      expect(firstRead).toHaveProperty('content', id);
      expect(secondRead).toHaveProperty('content', id);
    });
    it('should overwrite cache is forceReload is true', async () => {
      const id = uuid();
      const modulePath = absolute(`${tmpDir}/${id}.json`);
      await writeJson({ content: id }, modulePath);

      const firstRead = await firostImport(modulePath);

      await writeJson({ content: 'new-value' }, modulePath);
      const secondRead = await firostImport(modulePath, { forceReload: true });

      expect(firstRead).toHaveProperty('content', id);
      expect(secondRead).toHaveProperty('content', 'new-value');
    });
  });
});
