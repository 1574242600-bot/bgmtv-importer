const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.json');

module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    testPathIgnorePatterns: ['node_modules'],
    setupFiles: ['<rootDir>/jest.setup.ts'],
    modulePaths: [`<rootDir>/${ compilerOptions.baseUrl }`],
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths)
};