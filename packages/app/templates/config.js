function validateVersion(version) {
  const pattern = /^[0-9]{1,2}.[0-9]{1,2}.[0-9]{1,3}$/;
  return pattern.test(version);
}

export const questions = [
  {
    type: "input",
    name: "version",
    message: "version: ",
    validate(value) {
      // check for empty string
      if (validateVersion(value)) {
        return true;
      }

      return "Please enter version in {v.m.p} format";
    },
    default() {
      return "0.0.0";
    },
  },
  {
    type: "input",
    name: "author",
    message: "author: ",
    default: "",
  },
];

export const install = {
  dependencies: [
    "dotenv",
    "jquery",
    "jsdom",
    "uuid",
    "open",
    "commander",
    "xmlhttprequest",
  ],
  devDependencies: [
    "@types/node",
    "@types/npmlog",
    "@types/uuid",
    "@typescript-eslint/eslint-plugin",
    "@typescript-eslint/parser",
    "copyfiles@2.4.1",
    "eslint",
    "eslint-config-airbnb-base",
    "eslint-formatter-gitlab",
    "eslint-plugin-import",
    "tslib",
    "typescript",
  ],
};
