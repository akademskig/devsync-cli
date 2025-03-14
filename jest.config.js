/** @type {import('ts-jest').JestConfigWithTsJest} **/

module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+\.tsx?$": ["ts-jest", { useESM: true }],
  },
  preset: "ts-jest",
  collectCoverage: true,
  coverageDirectory: "coverage",
  verbose: true,
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  testMatch: ["**.test.ts"],
};