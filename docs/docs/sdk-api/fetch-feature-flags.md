---
sidebar_position: 2
---

# fetchFeatureFlags()

Instance method to fetch feature flags.

```js
fetchFeatureFlags({ id, email, data })
```

### Arguments

- `id` - User's id. **Optional**
- `email` - User's email. **Optional** (**Deprecated**: Please use `id` to identify user and put `email` in the `data`)
- `data` - Additional user's data. Used for enabling features by custom targeting rules. **Optional**

### Example

```js
import GrowthFlags from '@growthflags/js-sdk';

const flags = GrowthFlags.create({
  publicApiKey: 'pk_3a693ae7b88bf3afb8d9eca2304e7d66ff484a41bba6e211',
  env: 'staging',
})

const featureFlags = await flags.fetchFeatureFlags({
  id: '1', 
  data: { 
    companyId: '1', 
    email: 'john.locke@example.com' 
  } 
})
```
