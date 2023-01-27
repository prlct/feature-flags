---
sidebar_position: 3
---

# Email sequence webhooks

- Start - `POST: https://api.growthflags.com/sequences/webhook/start/:eventKey`
- Stop - `POST: https://api.growthflags.com/sequences/webhook/stop/:eventKey`

### Query params

- `eventKey` - `event` which is set in email sequence to be triggered.

### Params

 - `email` - email address for the user on the account. **Required**
 - `env` - environment of the sequence (`production`, `development`, `demo` or `staging`). **Required**
 - `firstName` - **Optional**.
 - `lastName` - **Optional**.

 ### Authentication

 - `privateApiKey` - `apiKey` which is specified in the `/api-key` tab

Type: Bearer
```
Authorization: Bearer <your privateApiKey>
```

### Response
 - 200 - ok

 - 400 - errors

```
{
  "errors": {
    "sequence": [
      "Sequence not found" | "No enabled emails found for the sequence" | "Pipeline not found"
    ]
  }
}
```
