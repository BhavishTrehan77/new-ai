import globals from "globals";
import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script",
      globals: {
        ...globals.browser,
        // Define browser DOM elements and objects loaded via global scripts
        Examiner: "readonly",
        Visualizers: "readonly",
        localStorage: "readonly",
        document: "readonly",
        window: "readonly",
        console: "readonly",
        fetch: "readonly",
        setTimeout: "readonly",
        Promise: "readonly"
      }
    },
    rules: {
      "no-unused-vars": ["warn", { "vars": "all", "args": "none" }],
      "no-undef": "error"
    }
  }
];
