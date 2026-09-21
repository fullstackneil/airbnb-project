import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default [
  { ignores: ["dist/"] },
  js.configs.recommended,
  { ...react.configs.flat.recommended, files: ["**/*.{js,jsx}"] },
  { ...react.configs.flat["jsx-runtime"], files: ["**/*.{js,jsx}"] },
  reactHooks.configs.flat["recommended-latest"],
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: { globals: { ...globals.browser } },
    settings: { react: { version: "18.2" } },
    plugins: { "react-refresh": reactRefresh },
    rules: {
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "react/prop-types": "off",
    },
  },
  {
    // The modal context file exports both components and a hook.
    files: ["src/context/*.jsx"],
    rules: { "react-refresh/only-export-components": "off" },
  },
  {
    files: ["*.config.js"],
    languageOptions: { globals: { ...globals.node } },
  },
];
