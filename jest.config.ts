import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  testEnvironment: 'node',
  verbose: true,
  preset: 'ts-jest',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testMatch: ['**/*.test.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '^(.{1,2}/.*)\\.js$': '$1', // Strip .js extensions
  },
};

export default config;