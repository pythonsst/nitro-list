module.exports = {
  preset: 'react-native',
  testEnvironment: 'node',

  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@testing-library)/)',
  ],

  setupFilesAfterEnv: [
    '<rootDir>/jest.setup.js',
  ],

  testPathIgnorePatterns: [
    '/node_modules/',
    '/lib/',
    '/example/',
  ],
}
