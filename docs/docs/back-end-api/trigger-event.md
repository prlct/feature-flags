---
sidebar_position: 2
---
# Trigger event

## Trigger email sequence start

`POST: https://api.growthflags.com/applications/trigger-event`

### Params:

 - `eventKey` - `event` which is set in email sequence to be triggered
 - `userId` - user id to find user's email
 - `firstName` - user first name to be injected into sequence emails
 - `lastName` - user last name to be injected into sequence emails

### Response:
 - 200 - ok
 - 400 - fail, no user found, no email for user or sequence not found / disabled
