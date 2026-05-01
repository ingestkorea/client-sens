# @ingestkorea/client-sens

[![npm (scoped)](https://img.shields.io/npm/v/@ingestkorea/client-sens?style=flat-square)](https://www.npmjs.com/package/@ingestkorea/client-sens)
[![npm downloads](https://img.shields.io/npm/dm/@ingestkorea/client-sens?style=flat-square)](https://www.npmjs.com/package/@ingestkorea/client-sens)
![build status](https://codebuild.ap-northeast-2.amazonaws.com/badges?uuid=eyJlbmNyeXB0ZWREYXRhIjoiOTYrKzNDRklOaWJxS2ZoTkZvY05TU2VGVFdxWFlSWE9DZXJTYVBlbCtwc0J5YTcvdUFKRjlSc1RDTHNDV1J4YnhxMmRLaFdIakpSVWN3QzBHQXp0KzdRPSIsIml2UGFyYW1ldGVyU3BlYyI6IjQ1dUtTMlE1UWhmWmFTRGsiLCJtYXRlcmlhbFNldFNlcmlhbCI6MX0%3D&branch=main)
[![license](https://img.shields.io/github/license/ingestkorea/client-sens?style=flat-square)](https://www.npmjs.com/package/@ingestkorea/client-sens)

## Description

INGESTKOREA SDK - Naver Cloud Platform SENS Client for Node.js.

INGESTKOREA SDK - SENS Client for Node.js is a lightweight library that contains only the essential features frequently used in SENS.

This SDK performs tasks such as the following automatically.

- Authentication using an API Signature
- Retrying requests
- Handling error responses

## Installing

```sh
npm install @ingestkorea/client-sens
```

## Getting Started

### Pre-requisites

- Use TypeScript v5.x
- Includes the TypeScript definitions for node.
  ```sh
  npm install -D typescript # save dev mode
  npm install -D @types/node # save dev mode
  ```

### Support Commands

#### Kakao Alimtalk

- SendAlimtalk
- GetAlimtalkStatus
- GetAlimtalkResult
- GetAlimtalkTemplate
- ListAlimtalkStatus
- ListAlimtalkTemplates
- ListAlimtalkChannels

#### SMS, LMS, MMS

- SendSMS (SMS, LMS)
- SendMMS (MMS)
- GetSMSStatus (SMS, LMS, MMS)
- GetSMSResult (SMS, LMS, MMS)
- ListSMSStatus (SMS, LMS, MMS)

### Import

The INGESTKOREA SDK - SENS Client is modulized by `client` and `commands`.

To send a request, you only need to import the SensClient and the commands you need, for example SendMessageCommand:

```ts
import { SensClient, SendAlimtalkCommand } from "@ingestkorea/client-sens";
```

### Usage

To send a request, you:

- Initiate client with configuration.
- Initiate command with input parameters.
- Call `send` operation on client with command object as input.

```ts
const client = new SensClient({
  /**
   * AccessKey, SecretKey: https://www.ncloud.com/mypage/manage/authkey
   * serviceId: https://console.ncloud.com/sens/project
   */
  credentials: {
    accessKey: "YOUR_ACCESS_KEY",
    secretKey: "YOUR_SECRET_KEY",
  },
  /**
   * at least one serviceId required
   * if you call send operation without serviceId, sdk throw error
   */
  serviceId: {
    kakao: "ncp:kkobizmsg:kr:xxxxxx:your-service-name",
    sms: "ncp:sms:kr:xxxxxx:your-service-name",
  },
});
```

#### SendAlimtalk

```ts
const command = new SendAlimtalkCommand({
  /** Required: Kakao PlusFriend ID (e.g., @kakao) */
  plusFriendId: "PLUS_FRIEND_ID",

  /** Required: Kakao Alimtalk TemplateCode ID (e.g., welcomeTemplate) */
  templateCode: "TEMPLATE_CODE",

  /** Required: List of messages to send (Max 100) */
  messages: [
    /** Recipient phone number (digits only), Message content */
    { to: "01012345678", content: "YOUR_CONTENT" },
  ],
});
```

#### ListAlimtalkStatus

```ts
const command = new ListAlimtalkStatusCommand({
  /** Required: Kakao PlusFriend ID (e.g., @kakao) */
  plusFriendId: "CHANNEL_ID",

  /**
   * Optional: Start time in KST (Format: yyyy-MM-ddTHH:mm:ss.SSS)
   * Defaults to 24 hours prior to requestEndTime if not provided.
   */
  requestStartTime: "yyyy-MM-ddTHH:mm:ss.SSS",

  /**
   * Optional: End time in KST (Format: yyyy-MM-ddTHH:mm:ss.SSS)
   * Defaults to the current system time if not provided.
   */
  requestEndTime: "yyyy-MM-ddTHH:mm:ss.SSS",
});
```

#### GetAlimtalkStatus

```ts
const command = new GetAlimtalkStatusCommand({ requestId: "ALIMTALK_REQUEST_ID" });
```

#### SendSMS (SMS, LMS)

- **Message Type Automation**: The SDK automatically determines the message type ('SMS' or 'LMS') based on the content length (EUC-KR encoding)

  - SMS: Up to 90 bytes
  - LMS: Up to 2,000 bytes

- **Default Value Policy**: If `subject` or `content` is not defined within the individual message object, the SDK uses the **top-level** `content` and the default subject ('제목없음').

```ts
const command = new SendSMSCommand({
  /** Sender's phone number (digits only) for all messages in the batch. */
  from: "01012345678",

  /** Default message content */
  content: "DEFAULT_CONTENT",
  messages: [
    /** Uses default message content */
    { to: "0101111xxxx" },

    /** Overrides with specific content */
    { to: "0102222xxxx", content: "CONTENT_01" },

    /** Overrides content & subject */
    { to: "0103333xxxx", content: "CONTENT_02", subject: "SUBJECT_01" },
  ],
});
```

#### SendMMS (MMS)

- **Multimedia Messaging**: Supports sending images along with your message. (Supported formats: `.jpg`, `.jpeg`)

- **Default Value Policy**: Same as `SendSMSCommand`, individual messages will inherit the top-level `content` and `subject` if not specified.

```ts
import { readFileSync } from "node:fs";

const command = new SendMMSCommand({
  /** Same as SendSMSCommand */
  ...
  files: [
    // 1. Specify the absolute path (The SDK will handle the file reading)
    { name: "/your/absolute/path/sample-image-1.jpg" },

    // 2. Pass base64 encoded data directly
    {
      name: "custom-image-name.jpg",
      body: readFileSync("/your/absolute/path/sample-image-2.jpg", { encoding: "base64" }),
    },
  ],
});
```

#### Async/await

```ts
(async () => {
  try {
    const data = await client.send(command);
    console.dir(data, { depth: 4 });
  } catch (err) {
    console.dir(err, { depth: 4 });
  }
})();
```

#### Promises

```ts
client
  .send(command)
  .then((data) => console.dir(data, { depth: 4 }))
  .catch((err) => console.dir(err, { depth: 4 }));
```

## Getting Help

We use the GitHub issues for tracking bugs and feature requests.

If it turns out that you may have found a bug, please open an issue.

## License

This SDK is distributed under the [MIT License](https://opensource.org/licenses/MIT), see LICENSE for more information.
