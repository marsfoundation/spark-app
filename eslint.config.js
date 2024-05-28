// @ts-check

const tseslint = require("typescript-eslint")

module.exports = tseslint.config(tseslint.configs.base, {
	files: ["**/*.ts"],
	languageOptions: {
		parserOptions: {
			parser: "@typescript-eslint/parser",
			project: "./tsconfig.json",
		},
	},
	rules: {
		"@typescript-eslint/no-floating-promises": "error",
	},
})