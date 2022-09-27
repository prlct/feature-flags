---
sidebar_position: 2
---

# fetchFeatureFlags()

Instance method to fetch feature flags.

```
fetchFeatureFlags({ email, data })
```

### Arguments

- `email` - User's email. **Optional**
- `data` - Additional user's data. Used for enabling features by custom targeting rules. **Optional**

### Example

```
import GrowthFlags from '@growthflags/js-sdk';

const flags = GrowthFlags.create({
  publicApiKey: 'pk_3a693ae7b88bf3afb8d9eca2304e7d66ff484a41bba6e211',
  env: 'staging',
})

const featureFlags = await flags.fetchFeatureFlags({ email: 'john.locke@example.com', data: { companyId: '1' } })
```
