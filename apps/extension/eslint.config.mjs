import js from "@eslint/js";
import { config as baseConfig } from "@linkyboard/eslint-config/base";

import { globalIgnores } from "eslint/config";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";

const config = [
  ...baseConfig,
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    ...js.configs.recommended,
    ...reactHooks.configs["recommended-latest"],
    ...reactRefresh.configs.vite,
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
];

export default config;
