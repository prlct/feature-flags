---
sidebar_position: 1
---

# create()

Method to Initialize SDK instance.

```js
create({ publicApiKey, env })
```

### Arguments

- `publicApiKey` - Your application public API key. **Required**
- `env` - Application environment. **Required**. Possible values are `development`, `staging` and `production`

:::info Since js-sdk version 1.4.5 

:::
- `defaultFeatures` - Object with feature flags that is used before actual feature flags received from the API
```js
import Flags from '@growthflags/js-sdk'
const defaultFeatures = {
  MY_NEW_UI: true,
}
const growthFlags = Flags.create({ env, publicApiKey, defaultFeatures })
```

### Example

```js
import GrowthFlags from '@growthflags/js-sdk';

const flags = GrowthFlags.create({
  publicApiKey: 'pk_3a693ae7b88bf3afb8d9eca2304e7d66ff484a41bba6e211',
  env: 'staging',
  defaultFeatures: {
    initializedEnabledFeature: true,
  }
})
```
