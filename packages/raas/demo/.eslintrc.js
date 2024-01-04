module.exports = {
  extends: ["../.eslintrc"],

  overrides: [
    {
      files: ["**/*.{ts,tsx}"],
      rules: {
        "jsdoc/require-jsdoc": 0,
        "no-console": 0,
        "@typescript-eslint/no-unused-vars": 0,
      },
    },
  ],

  ignorePatterns: ["!.eslintrc.js", "build/"],
};
