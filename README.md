# @ingestkorea/client-sens

[![npm (scoped)](https://img.shields.io/npm/v/@ingestkorea/client-sens?style=flat-square)](https://www.npmjs.com/package/@ingestkorea/client-sens)
[![NPM downloads](https://img.shields.io/npm/dm/@ingestkorea/client-sens?style=flat-square)](https://www.npmjs.com/package/@ingestkorea/client-sens)

## Description
INGESTKOREA SDK NCP SENS Client for Node.js.

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

### Support Methods
+ SendAlimtalk
+ GetRequestStatus
+ GetRequestResult
+ ListChannels
+ SendSMS

### Import
```ts
import {
  SensClient,
  SendAlimtalkCommand, SendAlimtalkCommandInput
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
  serviceId: { // at least one serviceId required
    sms: 'ncp:sms:kr:123456789xxx:your-service-name', // optional
    kakao: 'ncp:kkobizmsg:kr:9876xxx:your-service-name' // optional
    // if you call send operation without serviceId, sdk throw error
  }
});

let params: SendAlimtalkCommandInput = {
  plusFriendId: PLUS_FRIEND_ID,
  templateCode: TEMPLATE_CODE,
  messages: [
    { to: '01012345678', content: CONTENT }
  ]
};
let command = new SendAlimtalkCommand(params);
```

#### Async/await
```ts
(async () => {
  try {
    const data1 = await client.send(command);
    console.dir(data1, { depth: 4 });
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