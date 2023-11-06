/** @type {import("ts-jest").JestConfigWithTsJest} */
module.exports = {
  verbose: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  silent: false,
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testMatch: ["**/__tests__/**/*.tests.ts"],
  setupFilesAfterEnv: ["./jest.setup.ts"],
  coveragePathIgnorePatterns: [
    "<rootDir>/src/__tests__/utils/database.ts",
    "<rootDir>/src/index.ts",
],
};
  