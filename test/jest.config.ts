import type {Config} from '@jest/types';

// Sync object
const config: Config.InitialOptions = {
  preset: 'ts-jest',
  maxWorkers: '',
  rootDir: '../',
  verbose: true,
  setupFilesAfterEnv: ['./test/test.setup.ts'],
};
export default config;
