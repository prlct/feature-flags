---
sidebar_position: 6
---

# triggerEvent()
```typescript
  async triggerEvent(eventKey: string): Promise<string>
```
Triggers event by `eventKey` for current user.
If email sequence with trigger using this `eventKey` is set, adds the user to the sequence.

```javascript
import GrowthFlags from '@growthflags/js-sdk';

const flags = GrowthFlags.create({
  publicApiKey: 'pk_3a693ae7b88bf3afb8d9eca2304e7d66ff484a41bba6e211',
  env: 'staging',
});

flags.fetchFeatureFlags({ email: 'john.locke@example.com' })

const defaultConfig = { buttonText: 'Click me' };
const { enabled, config } = flags.getFeature('theFeature', { defaultConfig });

const Page = () => {
  return (
    // ...    
    {
      enabled && (
        <Button onClick={() => flags.triggerEvent('button-clicked')}>
          {config.buttonText}
        </Button>
      )
    }
  );
};
```
