module.exports = {
  parser: "babel-eslint",
  env: {
    es6: true,
    node: true,
    browser: true,
  },
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ["react"],
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:prettier/recommended",
  ],
  rules:{
      "prettier/prettier": "off",
      "css-modules/no-unused-class": "off", // Desactiva la regla de validación para las clases no utilizadas
      // ... Otras reglas ...
    }
};
