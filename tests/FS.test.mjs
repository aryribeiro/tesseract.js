import {
  describe, it, beforeAll, expect,
} from 'vitest';
import {
  SIMPLE_TEXT, TIMEOUT, OPTIONS, Tesseract,
} from './constants.mjs';

describe('FS', () => {
  let worker;
  beforeAll(async () => {
    worker = await Tesseract.createWorker('eng', 1, OPTIONS);
  }, 0);

  it('should write and read text from FS (using FS only)', async () => {
    const path = 'tmp.txt';
    await worker.FS('writeFile', [path, SIMPLE_TEXT]);
    const { data } = await worker.FS('readFile', [path, { encoding: 'utf8' }]);
    await worker.FS('unlink', [path]);
    expect(data.toString()).toBe(SIMPLE_TEXT);
  }, TIMEOUT);

  it('should write and read text from FS (using writeFile, readFile)', async () => {
    const path = 'tmp2.txt';
    await worker.writeText(path, SIMPLE_TEXT);
    const { data } = await worker.readText(path);
    await worker.removeFile(path);
    expect(data.toString()).toBe(SIMPLE_TEXT);
  }, TIMEOUT);
});
