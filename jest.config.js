module.exports = {
    moduleFileExtensions: ["js", "mjs"],
    testMatch: ["**/?(*.)+(spec|test).[tj]s?(x)", "**/?(*.)+(spec|test).mjs"],
    verbose: true,
    transform: {
      '^.+\\.(js|mjs)$': 'babel-jest',
    },
  };