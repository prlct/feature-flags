---
sidebar_position: 4
---

:::info Since js-sdk version 1.4.0 

:::

# getFeature()

Returns feature with remote config
```ts
interface Growthflags {
  //...
  getFeature(featureName: string): { 
    name: string,
    config: JSONObject,
    enabled: boolean,
    variant: { name: string, remoteConfig: JSONObject },
  }
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

const defaultConfig = { buttonText: 'Click me' };
const { enabled, config } = growthflags.getFeature('theFeature', { defaultConfig });

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

### Variants
:::info Since js-sdk version >=1.4.2

:::

```jsx
/* ... */
import analytics from 'any-analytics-you-using';

const defaultConfig = { buttonText: 'Click me' };
const { enabled, config, variant } = growthflags.getFeature('feature-with-ab', { defaultConfig });

const trackClicks = () => 
  analytics.sendEvent({ // Any analytics you use
    name: 'button-clicked',
    variant: variant.name,
    config: config,
    ... 
  });


const Page = () => {
  return (
    // ...    
    {
      enabled && (
        <Button onClick={trackClicks}>
          {config.buttonText}
        </Button>
      )
    }
  );
};

```