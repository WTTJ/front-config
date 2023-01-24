# @wttj/front-config

## Install

```
yarn add --dev @wttj/front-config
```

## Eslint

```js
// .eslintrc.js
module.exports = {
  extends: './node_modules/@wttj/front-config/lib/eslint',
  // or if you want typescript configuration
  // extends: './node_modules/@wttj/front-config/lib/eslint/eslintrc-typescript',
  // or if you want cypress configuration
  // extends: './node_modules/@wttj/front-config/lib/eslint/eslintrc-cypress',
}
```

## Prettier

```js
// prettier.config.js
module.exports = require('@wttj/front-config/lib/prettier')
```

## Stylelint

```js
// stylelint.config.js
module.exports = {
  extends: './node_modules/@wttj/front-config/lib/stylelint',
}
```

## Tsconfig

```json
// tsconfig.json
{
  "extends": "@wttj/front-config/lib/tsconfig/tsconfig.json",
  "compilerOptions": {
    "baseUrl": "src"
  },
  "include": ["src"]
}
```

## Scripts

```json
// package.json
{
  "scripts": {
    // ...
    "lint": "yarn lint:js && yarn lint:css && yarn lint:ts",
    "lint:js": "eslint src --max-warnings 0",
    "lint:css": "stylelint 'src/**/styles.ts' --allow-empty-input",
    "lint:ts": "tsc --noEmit"
  }
},
```

## VSCode

Install [eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) and [prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) extensions

```json
// your settings.json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```
