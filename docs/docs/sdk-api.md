---
sidebar_position: 2
---

# Web SDK API

## init()

**Async** method to Initialize SDK instance.

```
init(
  apiKey,
  env,
  {
    id,
    email,
    fullName,
  }?,
)
```

### Arguments

- `apiKey` - Your application public API key. **Required**
- `env` - Application environment. **Required**

User data is optional. You can pass it using the `identify()` method when the user is logged in.

- `id` - Unique user identifier. **Required**
- `email` - User's email. **Optional**
- `fullName` - User's full name. **Optional**

### Example

```
import { init } from 'feature-flags-sdk';

await init(
  apiKey: '123e4567-e89b-12d3-a456-426614174000',
  env: 'staging',
  {
    id: '62eacd2aae77c8534d741247',
    email: 'john.smith@gmail.com',
    fullName: 'John Smith',
  },
)
```

## identify()

**Async** method to identify the user.

```
identify({
  id,
  email,
  fullName,
})
```

### Arguments

- `id` - Unique user identifier. **Required**
- `email` - User's email. **Optional**
- `fullName` - User's full name. **Optional**

### Example

```
import { identify } from 'feature-flags-sdk';

await identify({
  id: '62eacd2aae77c8534d741247',
  email: 'john.smith@gmail.com',
  fullName: 'John Smith',
});
```

## isOn()

Check whether the function is enabled or not. **Returns boolean**

```
isOn(featureFlag)
```

### Arguments

- `featureFlag` - Feature flag name. **Required**

### Example

```
import { isOn } from 'feature-flags-sdk';

const isNotificationBarEnabled = isOn('NotificationBar');
```

## getConfig()

Obtaining the configuration for A/B testing. **Returns boolean**

```
getConfig(featureFlag)
```

### Arguments

- `featureFlag` - Feature flag name. **Required**

### Example

```
import { isOn, getConfig } from 'feature-flags-sdk';

if (isOn('NotificationBar')) {
  const config = getConfig('NotificationBar');

  return <Button color="config.buttonColor" >Subscribe</Button>
}
```
