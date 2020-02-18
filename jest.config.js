// jest.config.js
module.exports = {
  collectCoverageFrom: ['src/**/*.{js,jsx}'],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    'src/serviceWorker.js',
    'src/configureStore.js',
    'src/bees.js',
    'src/index.js',
    'src/tests/*.{js,jsx}',
    'src/__tests__/testing-helpers.js'
  ]
}
