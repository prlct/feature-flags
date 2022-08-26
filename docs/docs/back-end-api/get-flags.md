---
sidebar_position: 1
---

# Get feature flags

Get all feature flags for the specified environment

`GET: https://api.growthflags.com/feature-flags?env`

### Query params

- `env` - Application environment. **Required**. Possible values are `development`, `staging` and `production`

### Response

```
{
  results: [
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
  ]
}
```
