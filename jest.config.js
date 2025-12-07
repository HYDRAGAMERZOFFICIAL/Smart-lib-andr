module.exports = {
  preset: 'react-native',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/app/src/$1',
    '^@screens/(.*)$': '<rootDir>/app/src/screens/$1',
    '^@components/(.*)$': '<rootDir>/app/src/components/$1',
    '^@services/(.*)$': '<rootDir>/app/src/services/$1',
    '^@store/(.*)$': '<rootDir>/app/src/store/$1',
    '^@utils/(.*)$': '<rootDir>/app/src/utils/$1',
    '^@types/(.*)$': '<rootDir>/app/src/types/$1',
    '^@constants/(.*)$': '<rootDir>/app/src/constants/$1',
    '^@hooks/(.*)$': '<rootDir>/app/src/hooks/$1',
    '^@theme/(.*)$': '<rootDir>/app/src/theme/$1',
    '^@navigation/(.*)$': '<rootDir>/app/src/navigation/$1',
    '^@assets/(.*)$': '<rootDir>/app/assets/$1',
  },
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverageFrom: [
    'app/src/**/*.{ts,tsx}',
    '!app/src/**/*.d.ts',
    '!app/src/**/index.ts',
    '!app/src/navigation/**',
  ],
  coverageThreshold: {
    global: {
      statements: 50,
      branches: 40,
      functions: 50,
      lines: 50,
    },
  },
};
