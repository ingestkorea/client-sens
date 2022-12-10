# @ingestkorea/client-sens

[![npm (scoped)](https://img.shields.io/npm/v/@ingestkorea/client-sens?style=flat-square)](https://www.npmjs.com/package/@ingestkorea/client-sens)
[![NPM downloads](https://img.shields.io/npm/dm/@ingestkorea/client-sens?style=flat-square)](https://www.npmjs.com/package/@ingestkorea/client-sens)
![Build Status](https://codebuild.ap-northeast-2.amazonaws.com/badges?uuid=eyJlbmNyeXB0ZWREYXRhIjoiOTYrKzNDRklOaWJxS2ZoTkZvY05TU2VGVFdxWFlSWE9DZXJTYVBlbCtwc0J5YTcvdUFKRjlSc1RDTHNDV1J4YnhxMmRLaFdIakpSVWN3QzBHQXp0KzdRPSIsIml2UGFyYW1ldGVyU3BlYyI6IjQ1dUtTMlE1UWhmWmFTRGsiLCJtYXRlcmlhbFNldFNlcmlhbCI6MX0%3D&branch=main)

## Description
INGESTKOREA SDK Naver Cloud Platform SENS Client for Node.js.

## Installing
```sh
npm install @ingestkorea/client-sens
```

## Getting Started

### Pre-requisites
+ Use TypeScript v4.x
+ Includes the TypeScript definitions for node.
  ```sh
  npm install -D @types/node # save dev mode
  ```

### Support Commands
+ SendAlimtalk
+ GetAlimtalkStatus (`GetRequestStatus` is deprecated)
+ GetAlimtalkResult (`GetRequestResult` is deprecated)
+ GetAlimtalkTemplate (`GetTemplate` is deprecated)
+ ListAlimtalkTemplates (`ListTemplates` is deprecated)
+ ListAlimtalkChannels (`ListChannels` is deprecated)
+ SendSMS

### Import
```ts
import {
  SensClient,
  SendAlimtalkCommand, SendAlimtalkCommandInput,
  SendSMSCommand, SendSMSCommandInput,
} from '@ingestkorea/client-sens';
```

### Usage
To send a request, you:
+ Initiate client with configuration.
+ Initiate command with input parameters.
+ Call `send` operation on client with command object as input.

```ts
// a client can be shared by different commands.
const client = new SensClient({
  credentials: {
    accessKey: ACCESS_KEY,
    secretKey: SECRET_KEY
  },
  serviceId: {
    sms: 'ncp:sms:kr:123456789xxx:your-service-name', // optional
    kakao: 'ncp:kkobizmsg:kr:9876xxx:your-service-name' // optional
    // at least one serviceId required
    // if you call send operation without serviceId, sdk throw error
  }
});
```

#### SendAlimtalk
```ts
let params: SendAlimtalkCommandInput = {
  plusFriendId: PLUS_FRIEND_ID,
  templateCode: TEMPLATE_CODE,
  messages: [
    { to: '01012345678', content: CONTENT }
  ]
};
let command = new SendAlimtalkCommand(params);
```

#### SendSMS
```ts
/**
 * Automatically set message type('SMS' | 'LMS') according to content-length(euc-kr)
 * SMS: max 80bytes
 * LMS: max 2000bytes
 */
let params: SendSMSCommandInput = {
  from: '01012345678',
  content: CONTENT,
  messages: [
    { to: '01087654321' }
  ]
};
let command = new SendSMSCommand(params);
```

#### Async/await
```ts
(async () => {
  try {
    const data = await client.send(command);
    console.dir(data, { depth: 4 });
  } catch (err){
    console.dir(err, { depth: 4 });
  };
})();
```

#### Promises
```ts
client.send(command)
  .then(data => console.dir(data, { depth: 4 }))
  .catch(err => console.dir(err, { depth: 4 }));
```

## License
This SDK is distributed under the [MIT License](https://opensource.org/licenses/MIT), see LICENSE for more information.