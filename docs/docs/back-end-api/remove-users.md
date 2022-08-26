---
sidebar_position: 4
---

# Revert enabling for user

Revert enabling of feature flag for a specific users

`DELETE: https://api.growthflags.com/feature-flags/:featureName/users`

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
