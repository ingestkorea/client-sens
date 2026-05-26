# Change Log

## v1.11.0 (2026-05-26)

### Changed

- 프로젝트에서 `"type": "module"` 사용시 순수 ESM 구조(`import/export`) 지원.
- ESM 및 CJS 빌드의 최하위 지원 타겟을 `ES2022`로 상향 및 통일: 네이티브 비동기 스택 트레이스 출력을 지원하여 에러 디버깅 편의성 개선
- **Naver Cloud Platform API 메타데이터 지원**: `x-ncp-trace-id`
- **NaverCommerceClient**:
  - `HttpHandlerOptions`을 통한 유연한 사용자 설정 지원.
- **NodeHttpHandler**:
  - **connectionTimeout**, **socketTimeout** 기본값 각각 2000ms, 3000ms로 변경.
  - **keepAlive** 기본값을 `false`로 변경. (socket hang up 방지)
  - `ipv4` 주소 강제. (네이버 클라우드 플랫폼 API 서버는 ipv4만 지원)
- **middlewareRetry**:
  - HTTP Request Retry 정책 추가. (`SDK.TIMEOUT`, `SDK.NETWORK_ERROR`)

## v1.10.0 (2026-05-01)

### Features

- **Common**

  - HTTP 핸들러 업데이트: `NodeHttpHandler` 요청 실패시 중복 호출 방지 기능 추가, socket 처리 방식 변경.
  - 에러 표준화: `SensError` 클래스 통한 에러 표준화. ([SENS](https://api.ncloud-docs.com/docs/sens-overview#응답상태코드), [Ncloud](https://api.ncloud-docs.com/docs/common-ncpapi#api-공통-설정), SDK 내부 오류)

  ```ts
  type SesnResponseErrorType =
    | "Bad Request"
    | "Unauthorized"
    | "Forbidden"
    | "Not Found"
    | "Too Many Requests"
    | "Internal Server Error";

  type SensClientErrorType = "SDK.AUTH_ERROR" | "SDK.GENERAL_ERROR" | "SDK.REQUEST_ERROR" | "SDK.UNKNOWN_ERROR";

  type SensErrorType = SesnResponseErrorType | SensClientErrorType;
  ```

## v1.9.0 (2026-04-12)

### Features

- **Common**

  - 응답 값 시간 포맷 변경: KST -> UTC (ex. requestTime, completeTime 등)
  - Get 명령어 기본 페이지네이션 사이즈 변경: 100개
  - List 명령어 기본 페이지네이션 사이즈 및 검색 범위 변경: 20개 / 30일
  - List 명령어 검색 날짜 UTC 포맷 지원: `Z` 접미사가 없는 경우 기본 KST로 처리
  - List 명령어 페이지네이션 조건 강화: `nextToken` 사용 시 최초 요청한 검색 옵션(시간, 사이즈 등) 변경 제한 및 필수값 검증 추가

- **Alimtalk**

  - **SendAlimtalk**: `useSmsFailover` 옵션 추가

- **SMS**

  - **GetSMSStatus**: 페이지네이션 기능 추가 및 응답 내 `메시지 발송 상태` 파라미터 추가
  - **GetSMSResult**: 응답 값에 `subject`, `fileId` 파라미터 추가
  - **ListSMSStatus**: 메시지 발송 목록 조회 명령어 추가 (SMS, LMS, MMS 지원)
