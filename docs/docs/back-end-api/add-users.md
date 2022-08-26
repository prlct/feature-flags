---
sidebar_position: 2
---

# Enable for user

Enable feature flag for a specific users

`PUT: https://api.growthflags.com/feature-flags/:featureName/users`

### Query params

- `featureName` - Feature name. **Required**.

### Body fields

- `env` - Application environment. **Required**. Possible values are `development`, `staging` and `production`
- `users` - An array of user emails. **Required**. At least one email **Required**

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
