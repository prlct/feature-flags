---
sidebar_position: 3
---

# Enable feature flag

Enable or disable feature flag

`PUT: https://api.growthflags.com/feature-flags/:featureName`

### Query params

- `featureName` - Feature name. **Required**.

### Body fields

- `env` - Application environment. **Required**. Possible values are `development`, `staging` and `production`
- `enabled` - Enables or disables the feature flag. **Optional**.
- `enabledForEveryone` - Enables or disables the feature flag for all users or specific users. **Optional**.

Either `enabled` or `enabledForEveryone` **Required** in request

### Response

```
{
  _id: string;
  name: string;
  description: string;
  enabled: boolean;
  enabledForEveryone: boolean;
  users: string[];
  env: 'development' | 'staging' | 'production';
  createdOn: string;
  updatedOn: string;
}
```

### Authentication
Type: Bearer
```
Authorization: Bearer <your private token>
```
