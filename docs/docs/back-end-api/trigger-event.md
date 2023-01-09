---
sidebar_position: 2
---
# Trigger event

## Trigger email sequence start

`POST: https://api.growthflags.com/applications/trigger-event`

### Params:

 - `eventKey` - `event` which is set in email sequence to be triggered. **Required**.
 - `userId` - user id to find user's email. **Required**.
 - `firstName` - user first name to be injected into sequence emails. **Optional**.
 - `lastName` - user last name to be injected into sequence emails. **Optional**.

### Authentication

 - `publicApiKey` - `apiKey` which is specified in the `/api-key` tab

Type: Bearer
```
Authorization: Bearer <your publicApiKey>
```

### Response:
 - 200 - ok
 - 400 - fail, no user found, no email for user or sequence not found / disabled
