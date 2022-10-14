---
sidebar_position: 3
---

# isOn()

Checks whether the feature flag is on or off. **Returns boolean**

```
isOn(featureName)
```

### Arguments

- `featureName` - Feature flag name. **Required**

### Example

```jsx
import GrowthFlags from '@growthflags/js-sdk';

const flags = GrowthFlags.create({
  publicApiKey: 'pk_3a693ae7b88bf3afb8d9eca2304e7d66ff484a41bba6e211',
  env: 'staging',
})

flags.fetchFeatureFlags({ email: 'john.locke@example.com' })

const Page = () => (
  <Layout mode={flags.isOn("DarkMode") ? 'dark' : 'light'}>
    ...
  </Layout>
)
```
