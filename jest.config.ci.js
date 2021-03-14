const baseConfig = require('./jest.config');

module.exports = {
    ...baseConfig,
    "reporters": [
        ["jest-junit", { outputName: "test-results.xml" }]
    ]
}