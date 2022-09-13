---
sidebar_position: 4
---

# setFeatures(features[])

Override features returned by API. Often used to implement

```
setFeatures(features[])
```

### Arguments

- `features[]` - Array of features to override. **Required**

Feature type:
```
{
  name: string;
  enabled: boolean;
}
```

### Example

```
import GrowthFlags from '@growthflags/js-sdk';

const flags = GrowthFlags.create({
  publicApiKey: 'pk_3a693ae7b88bf3afb8d9eca2304e7d66ff484a41bba6e211',
  env: 'staging',
})

flags.setFeatures([{ name: 'DarkMode', enabled: true }])
```
