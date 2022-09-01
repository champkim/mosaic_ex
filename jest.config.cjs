module.exports = {
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
    "^.+\\.svelte$": ["svelte-jester", { preprocess: true }],
    "^.+\\.svg$": "jest-transformer-svg"
  },
  moduleNameMapper: { "^.+\\.(css|less|scss)$": "babel-jest" },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(js?|ts?|svelte?)$",
  moduleFileExtensions: ["js", "ts", "svelte"],
  modulePathIgnorePatterns: ["dist", "build"],
  testEnvironment: "jsdom",
  globals: {
    window: {},
    "ts-jest": {
      babelConfig: true,
      tsconfig: "tsconfig.json",
    },
  },
  transformIgnorePatterns: [
    "node_modules/(?!(react-native|my-project)/)",
  ],
};
