import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import onlyWarn from "eslint-plugin-only-warn";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import turboPlugin from "eslint-plugin-turbo";

/**
 * A shared ESLint configuration for the repository.
 *
 * @type {import("eslint").Linter.Config[]}
 * */
export const config = [
  js.configs.recommended,
  eslintConfigPrettier,
  {
    plugins: {
      turbo: turboPlugin,
    },
    rules: {
      "turbo/no-undeclared-env-vars": "warn",
    },
  },
  {
    plugins: {
      onlyWarn,
      "simple-import-sort": simpleImportSort,
    },
  },
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "no-unused-vars": "off",
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            ["^\\u0000"],
            ["^react$", "^next"],
            ["^@"],
            ["^[a-z]"],
            ["^~"],
            ["^\\./", "^\\.\\./"],
          ],
        },
      ],
    },
  },
  {
    ignores: ["dist/**"],
  },
];
