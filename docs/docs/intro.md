---
sidebar_position: 1
slug: /
---

# Getting Started Guide

Let's discover **Growthflags in less than 5 minutes**.

## Installation

Install Growthflags SDK in the root of your web application

```
npm i @growthflags/js-sdk
```

## Initialize Growthflags SDK

Initialize SDK

```
import GrowthFlags from "@growthflags/js-sdk";

const flags = GrowthFlags.create({
  env: 'development',
  publicApiKey: 'pk_3a693ae7b88bf3afb8d9eca2304e7d66ff484a41bba6e211'
})
```

## Add method to fetch Growthflags on page load, pass the user

```
await flags.fetchFeatureFlags({ email: 'john.locke@example.com' })
```

## Use flags

```
const Page = () => (
  <Layout mode={flags.isOn("DarkMode") ? 'dark' : 'light'}>
    ...
  </Layout>
)
```
