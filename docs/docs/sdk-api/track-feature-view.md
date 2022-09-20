---
sidebar_position: 5
---

# trackFeatureView()

Saves event to the user events log. Used for counting how many users saw a feature.

```
trackFeatureView(featureName)
```

### Arguments

- `featureName` - Name of a feature. **Required**

### Example

```
import GrowthFlags from '@growthflags/js-sdk';

const flags = GrowthFlags.create({
  publicApiKey: 'pk_3a693ae7b88bf3afb8d9eca2304e7d66ff484a41bba6e211',
  env: 'staging',
})

flags.trackFeatureView('testFeature')
```
