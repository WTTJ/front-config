# wttj-config-front


## Install

```
yarn add wttj-config-front
```

## Set up eslint rules

### If you want to use all rules
```
// .eslintrc.js
module.exports = require('wttj-config-front/.eslintrc')
```

### If you want to override some rules
```
// .eslintrc.js

const merge = require('lodash.merge')
const shared = require('wttj-config-front/.eslintrc')
const local = {
  rules: {
    // Add any overrides here
  }
}

module.exports = merge({}, shared, local)

```

## Set up Prettier rules

```
// prettier.config.js
module.exports = require('wttj-config-front/prettier.config.js')
```