module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/sdk/$1',
  },
  collectCoverageFrom: [
    'sdk/**/*.ts',
    '!sdk/**/*.d.ts',
  ],
};
