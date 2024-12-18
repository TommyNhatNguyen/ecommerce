module.exports = {
  preset: 'ts-jest', // Use ts-jest preset for TypeScript support
  testEnvironment: 'node', // Set the test environment to Node.js
  moduleFileExtensions: ['ts', 'js', 'json'], // Recognize these file extensions
  testMatch: ['**/__tests__/**/*.test.ts'], // Match test files with .test.ts extension
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1', // Map 'src/' alias to actual project directory
    '^@models/(.*)$': '<rootDir>/src/models/$1', // Map '@models/' alias to the correct directory
  },
  verbose: true, // Display individual test results with the test suite hierarchy
  forceExit: false, // Do not force Jest to exit after all tests complete
  transform: {
    '^.+\\.tsx?$': 'ts-jest', // Use ts-jest to transform TypeScript files
  },
  transformIgnorePatterns: [
    '/node_modules/(?!your-esm-package)', // Add exceptions for ESM packages if needed
  ],
};
