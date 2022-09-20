---
sidebar_position: 1
---

# create()

Method to Initialize SDK instance.

```
create({ publicApiKey, env })
```

### Arguments

- `publicApiKey` - Your application public API key. **Required**
- `env` - Application environment. **Required**. Possible values are `development`, `staging` and `production`

### Example

```
import GrowthFlags from '@growthflags/js-sdk';

const flags = GrowthFlags.create({
  publicApiKey: 'pk_3a693ae7b88bf3afb8d9eca2304e7d66ff484a41bba6e211',
  env: 'staging',
})
```
