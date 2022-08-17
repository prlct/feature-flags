---
sidebar_position: 1
---

# Introduction

Let's discover **Feature Flags in less than 5 minutes**.

## Installation

Install Feature Flags sdk in the root of your web application

```
npm i @paralect/feature-flags-sdk
```

## Initialize Feature Flags SDK

Initialize Feature Flags SDK to get flags for a specific user in your application

```
import flags from "@paralect/feature-flags-sdk";

await flags.init(
  apiKey: '123e4567-e89b-12d3-a456-426614174000',
  env: 'staging',
  {
    id: '62eacd2aae77c8534d741247',
    email: 'john.smith@gmail.com',
    fullName: 'John Smith',
  },
);
```

## Use Feature Flags

```
import flags from "@paralect/feature-flags-sdk";


const YourComponent = () => {
  return (
    <>
      ...
      {flags.isOn('RedesignedVideoPlayer') ? <RedesignedVideoPlayer /> : <VideoPlayer />}
    </>
  )
};
```

## Use configuration for A/B testing

```
import flags from "@paralect/feature-flags-sdk";


const YourForm = () => {
  const config = flags.getConfig('NewFormDesign');

  return (
    <form>
      <TextInput
        label={config.input.label}
        placeholder={config.input.placeholder}
      />
      <Textarea
        label={config.textarea.label}
        placeholder={config.textarea.placeholder}
        color={config.textarea.color}
      />
      <Button color={config.button.color}>{config.button.text}</Button>
    </form>
  )
};
```
