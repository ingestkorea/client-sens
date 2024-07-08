# @ingestkorea/client-sens

[![npm (scoped)](https://img.shields.io/npm/v/@ingestkorea/client-sens?style=flat-square)](https://www.npmjs.com/package/@ingestkorea/client-sens)
[![npm downloads](https://img.shields.io/npm/dm/@ingestkorea/client-sens?style=flat-square)](https://www.npmjs.com/package/@ingestkorea/client-sens)
![build status](https://codebuild.ap-northeast-2.amazonaws.com/badges?uuid=eyJlbmNyeXB0ZWREYXRhIjoiOTYrKzNDRklOaWJxS2ZoTkZvY05TU2VGVFdxWFlSWE9DZXJTYVBlbCtwc0J5YTcvdUFKRjlSc1RDTHNDV1J4YnhxMmRLaFdIakpSVWN3QzBHQXp0KzdRPSIsIml2UGFyYW1ldGVyU3BlYyI6IjQ1dUtTMlE1UWhmWmFTRGsiLCJtYXRlcmlhbFNldFNlcmlhbCI6MX0%3D&branch=main)
[![license](https://img.shields.io/github/license/ingestkorea/client-sens?style=flat-square)](https://www.npmjs.com/package/@ingestkorea/client-sens)

## Description

INGESTKOREA SDK Naver Cloud Platform SENS Client for Node.js.

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
- ListAlimtalkTemplates
- ListAlimtalkChannels

#### SMS, LMS, MMS

- SendSMS (SMS, LMS)
- SendMMS (MMS)
- GetSMSStatus (SMS, LMS, MMS)
- GetSMSResult (SMS, LMS, MMS)

### Import

```ts
import {
  SensClient,
  SendAlimtalkCommand,
  SendAlimtalkCommandInput,
  SendSMSCommand,
  SendSMSCommandInput,
  SendMMSCommand,
  SendMMSCommandInput,
} from "@ingestkorea/client-sens";
```

### Usage

To send a request, you:

- Initiate client with configuration.
- Initiate command with input parameters.
- Call `send` operation on client with command object as input.

```ts
// a client can be shared by different commands.
const client = new SensClient({
  credentials: {
    accessKey: ACCESS_KEY,
    secretKey: SECRET_KEY,
  },
  serviceId: {
    sms: "ncp:sms:kr:123456789xxx:your-service-name", // optional
    kakao: "ncp:kkobizmsg:kr:9876xxx:your-service-name", // optional
  },
});

/**
 * accessKey, secretKey: https://www.ncloud.com/mypage/manage/authkey
 * serviceId: https://console.ncloud.com/sens/project
 *
 * at least one serviceId required
 * if you call send operation without serviceId, sdk throw error
 */
```

#### SendAlimtalk

```ts
let params: SendAlimtalkCommandInput = {
  plusFriendId: PLUS_FRIEND_ID,
  templateCode: TEMPLATE_CODE,
  messages: [{ to: "01012345678", content: CONTENT }],
};
let command = new SendAlimtalkCommand(params);
```

#### SendSMS (SMS, LMS)

```ts
/**
 * Automatically set message type('SMS' | 'LMS') according to content-length(euc-kr)
 * SMS: max 90bytes
 * LMS: max 2000bytes
 */
let params: SendSMSCommandInput = {
  from: '01012345678',
  content: DEFAULT_CONTENT,
  messages: [
    { to: '0109182xxxx' },
    { to: '0104321xxxx', content?: OPTIONAL_CONTENT_01 }
    { to: '0108765xxxx', content?: OPTIONAL_CONTENT_02, subject?: OPTIONAL_SUBJECT_01 },
  ]
};
/**
 * If you do not define the subject and content within the messages,
 * it is sent with the value specified as the default subject('제목없음') and content.
 */
let command = new SendSMSCommand(params);
```

#### SendMMS (MMS)

```ts
import { readFileSync } from 'node:fs';

let params: SendMMSCommandInput = {
  from: '01012345678',
  content: DEFAULT_CONTENT,
  messages: [
    { to: '0109182xxxx' },
    { to: '0104321xxxx', content?: OPTIONAL_CONTENT_01 }
    { to: '0108765xxxx', content?: OPTIONAL_CONTENT_02, subject?: OPTIONAL_SUBJECT_01 },
  ],
  files: [ // support jpg, jpeg
    { name: '/your/absolute/path/sample-image-1.jpg' },
    {
      name: '/your/absolute/path/sample-image-2.jpg',
      body?: readFileSync('/your/absolute/path/sample-image-2.jpg', { encoding: 'base64' })
    }
  ]
};
/**
 * If you do not define the subject and content within the messages,
 * it is sent with the value specified as the default subject('제목없음') and content.
 */
let command = new SendMMSCommand(params);
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

## License

This SDK is distributed under the [MIT License](https://opensource.org/licenses/MIT), see LICENSE for more information.
