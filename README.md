# @ingestkorea/client-sens

[![npm (scoped)](https://img.shields.io/npm/v/@ingestkorea/client-sens?style=flat-square)](https://www.npmjs.com/package/@ingestkorea/client-sens)
[![npm downloads](https://img.shields.io/npm/dm/@ingestkorea/client-sens?style=flat-square)](https://www.npmjs.com/package/@ingestkorea/client-sens)
[![license](https://img.shields.io/github/license/ingestkorea/client-sens?style=flat-square)](https://www.npmjs.com/package/@ingestkorea/client-sens)

## Description

INGESTKOREA SDK - Naver Cloud Platform SENS Client for Node.js.

SENS(Simple & Easy Notification Service) SDK는 [네이버 클라우드 SENS](https://www.ncloud.com/product/applicationService/sens)에서 필수적으로 사용되는 메서드 위주로 구현된 가벼운 라이브러리입니다.

SDK는 아래 작업들을 내부적으로 수행합니다.

- 공통 헤더를 이용한 인증(Signature, Timestamp, AccessKey)
- API 요청 실패시 지능형 재시도
- SENS API, Ncloud API 표준 에러 핸들링

SDK는 [SENS API Docs](https://api.ncloud-docs.com/docs/sens-overview), [Ncloud API Docs](https://api.ncloud-docs.com/docs/common-ncpapi#응답)에서 제공하는 형식을 준수합니다.

**주의사항**: SENS 서비스 이용을 위해서는 아래 정보들이 필요합니다

- [Naver Cloud Platform API 인증키](https://www.ncloud.com/mypage/manage/authkey): **AccessKey**, **SecretKey**
- [SENS 이용 서비스 정보](https://console.ncloud.com/sens/project): **ServiceId**

## Getting Started

### Installing

```sh
npm install @ingestkorea/client-sens
```

### Pre-requisites

SDK는 아래 사항들을 요구합니다.

- TypeScript v5 이상
- Node v22 이상

```sh
# save dev mode
npm install -D typescript
npm install -D @types/node
```

## Support Methods

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

## Import

Simple & Easy Notification Service SDK는 `client`, `commands` 두 개의 모듈로 구성되어 있습니다.

SDK 사용을 위해서는 `SensClient`, 필요한 `Command` 단 두 개만 import 하면 됩니다. (예시를 위해 `SendMessageCommand`를 사용하겠습니다.)

```ts
import { SensClient, SendAlimtalkCommand } from "@ingestkorea/client-sens";
```

### Usage

요청을 보내기 위해서는

- Client 초기화 / 설정 정보 필요(ex. credentials)
- Command 초기화 / 파라미터 값들 필요
- `send` 메서드 호출 / Command 객체 필요

`SensClient`가 내부적으로 사용하는 **httpHandler**는 기본적으로 다음 옵션이 적용됩니다.

- **connectionTimeout**: 2000ms
- **socketTimeout**: 3000ms
- **keepAlive**: false
- **family**: ipv4

```ts
// 초기화된 client는 다른 요청에도 재사용 가능합니다.
const client = new SensClient({
  credentials: {
    accessKey: "YOUR_ACCESS_KEY",
    secretKey: "YOUR_SECRET_KEY",
  },
  // 최소 1개 이상의 serviceId 정보가 필요합니다.
  serviceId: {
    kakao: "ncp:kkobizmsg:kr:xxxxxx:your-service-name",
    sms: "ncp:sms:kr:xxxxxx:your-service-name",
  },
  // 선택 (필요시 변경 가능)
  httpHandler: {
    connectionTimeout: 2000,
    ...
  },
});
```

#### SendAlimtalk

```ts
const command = new SendAlimtalkCommand({
  plusFriendId: "PLUS_FRIEND_ID", // @plusfriendId
  templateCode: "TEMPLATE_CODE", // TemplateCode ID (e.g., welcomeTemplate)
  messages: [
    // 최대 100개까지 요청 가능
    { to: "01012345678", content: "YOUR_CONTENT" },
  ],
});
```

```json
{
  "$metadata": {
    "httpStatusCode": 202,
    "attempts": 1,
    "totalRetryDelay": 0,
    "traceId": "xxxxxx"
  },
  "requestId": "xxxx-xxxx-xxxx-xxxx-xxxx",
  "requestTime": "2026-01-23T12:34:56.789Z",
  "statusCode": "202",
  "statusName": "processing",
  "messages": [
    {
      "messageId": "xxxx-xxx-xxxx-xxxx-xxxx",
      "to": "010xxxxzzzz",
      "countryCode": "82",
      "content": "xxxx",
      ...
      "requestStatusCode": "A000",
      "requestStatusName": "success",
      "requestStatusDesc": "성공",
      "useSmsFailover": false
    }
  ]
}
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
const command = new GetAlimtalkStatusCommand({
  requestId: "ALIMTALK_REQUEST_ID",
});
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

### Async/await

```ts
import {
  SensClient, SendAlimtalkCommand, SensError
} from "@ingestkorea/client-sens";

(async () => {
  try {
    // a client can be shared by different commands.
    const client = new SensClient({...});
    const command = new SendAlimtalkCommand({...});

    const output = await client.send(command);
    console.log(output);
  } catch (error) {
    if (error instanceof SensError) {
      ...
    }
    console.error(error)
  }
})();
```

## Getting Help

기능 추가 요청, 버그 신고는 깃허브 이슈를 사용해주세요.

## License

This SDK is distributed under the [MIT License](https://opensource.org/licenses/MIT), see LICENSE for more information.
