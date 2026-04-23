const globals = require("globals");
const tsParser = require("@typescript-eslint/parser");
const tsPlugin = require("@typescript-eslint/eslint-plugin");

module.exports = [
	{ ignores: ["dist", "node_modules"] },

	// Конфигурация для JavaScript файлов (webpack конфиги остаются на JS)
	{
		files: ["**/*.{js,jsx}"],
		languageOptions: {
			ecmaVersion: "latest",
			sourceType: "module",
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
		rules: {
			"no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
			"no-console": "warn",
			"no-undef": "error",
			"no-constant-condition": ["error", { checkLoops: false }],
		},
	},

	// Конфигурация для TypeScript файлов
	{
		files: ["**/*.{ts,tsx}"],
		languageOptions: {
			// Специальный парсер — умеет читать TypeScript синтаксис
			parser: tsParser,
			ecmaVersion: "latest",
			sourceType: "module",
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
		plugins: {
			"@typescript-eslint": tsPlugin,
		},
		rules: {
			// Базовые рекомендуемые правила @typescript-eslint
			...tsPlugin.configs.recommended.rules,
			// Отключаем JS-версию no-unused-vars, включаем TS-версию
			"no-unused-vars": "off",
			"@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
			"no-console": "warn",
		},
	},
];
