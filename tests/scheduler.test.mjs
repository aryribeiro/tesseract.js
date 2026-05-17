import {
  describe, it, beforeAll, expect,
} from 'vitest';
import { IMAGE_PATH, OPTIONS, Tesseract } from './constants.mjs';

describe('scheduler', () => {
  let workers = [];

  beforeAll(async () => {
    const NUM_WORKERS = 5;
    console.log(`Initializing ${NUM_WORKERS} workers`);
    workers = await Promise.all(Array(NUM_WORKERS).fill(0).map(async () => (Tesseract.createWorker('eng', 1, OPTIONS))));
    console.log(`Initialized ${NUM_WORKERS} workers`);
  }, 0);

  describe('should speed up with more workers (running 10 jobs)', () => {
    [1, 3, 5].forEach((num) => (
      it(`support using ${num} workers`, async () => {
        const NUM_JOBS = 10;
        const scheduler = Tesseract.createScheduler();
        workers.slice(0, num).forEach((w) => {
          scheduler.addWorker(w);
        });
        const rets = await Promise.all(Array(NUM_JOBS).fill(0).map((_, idx) => (
          scheduler.addJob('recognize', `${IMAGE_PATH}/${idx % 2 === 0 ? 'simple' : 'cosmic'}.png`)
        )));
        expect(rets.length).toBe(NUM_JOBS);
      }, 60000)
    ));
  });
});
