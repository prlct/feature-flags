---
sidebar_position: 4
---

# getFeature()

Returns feature with remote config
```ts
interface Growthflags {
  //...
  getFeature(featureName: string): { name: string, config: JSONObject, enabled: boolean }
}
```

### Arguments

- `featureName` - Feature flag name. **Required**

### Example

Feature `theFeature` exists with remote config:
```JSON
{
  "buttonText": "Press me"
}
```

```jsx
import GrowthFlags from '@growthflags/js-sdk';

const flags = GrowthFlags.create({
  publicApiKey: 'pk_3a693ae7b88bf3afb8d9eca2304e7d66ff484a41bba6e211',
  env: 'staging',
});

flags.fetchFeatureFlags({ email: 'john.locke@example.com' })

const { enabled, config } = growthflags.getFeature('theFeature');
const customText = feature.enabled && feature.config.customText;

const defaultText = 'Default';

const Page = () => {
  return (
    // ...    
    {
      enabled && (
        <Button>
          {config.buttonText}
        </Button>
      )
    }
  );
};

```