const globals = require("globals");

module.exports = [
	{ ignores: ["dist", "node_modules"] },
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
			// Рекомендуемые правила ESLint
			"no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
			"no-console": "warn",
			"no-undef": "error",
			"no-constant-condition": ["error", { checkLoops: false }],
		},
	},
];
