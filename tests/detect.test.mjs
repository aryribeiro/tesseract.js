import {
  describe, it, beforeAll, expect,
} from 'vitest';
import {
  IMAGE_PATH, TIMEOUT, OPTIONS, Tesseract,
} from './constants.mjs';

describe('detect()', () => {
  let worker;
  beforeAll(async () => {
    worker = await Tesseract.createWorker('osd', 0, OPTIONS);
  }, 0);

  it('should detect OSD', async () => {
    const { data: { script: s } } = await worker.detect(`${IMAGE_PATH}/cosmic.png`);
    expect(s).toBe('Latin');
  }, TIMEOUT);

  it('should detect OSD (simplified interface)', async () => {
    const { data: { script: s } } = await Tesseract.detect(`${IMAGE_PATH}/cosmic.png`, OPTIONS);
    expect(s).toBe('Latin');
  }, TIMEOUT);
});
